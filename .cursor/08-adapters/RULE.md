---
description: 'Adapter implementations: Supabase, R2 storage, KV cache.'
alwaysApply: false
globs: ['packages/domains/**/adapters/**/*']
---

# Adapters Pattern

**Trigger:** Implementing repository, storage, or cache adapters

## Structure

```
adapters/
├── [domain].supabase.adapter.ts
├── [domain].storage.adapter.ts
├── [domain].cache.adapter.ts
└── index.ts
```

## Core Principle

> ⛔ Adapters = DATA TRANSFORMATION ONLY. No business logic.

| Does                  | Does NOT                  |
| --------------------- | ------------------------- |
| Map Entity ↔ DB Row   | Validate business rules   |
| Call external service | Make business decisions   |
| Transform errors      | Calculate business values |
| Handle pagination     | Orchestrate workflows     |

---

## Supabase Adapter

```typescript
class [Entity]SupabaseAdapter implements [Entity]RepositoryPort {
  constructor(private readonly client: SupabaseClient<Database>) {}

  // CREATE
  async create(data: CreateDTO): Promise<Result<Entity>> {
    const { data: row, error } = await this.client
      .from('[entities]')
      .insert(this.toInsertRow(data))
      .select()
      .single();
    if (error) return err(this.mapError(error));
    return ok(this.toEntity(row));
  }

  // READ
  async findById(id: string): Promise<Entity | null> {
    const { data } = await this.client
      .from('[entities]')
      .select('*, [entity]_items(*)')
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    return data ? this.toEntity(data) : null;
  }

  // READ with relations (join)
  async findByIdWithRelations(id: string): Promise<Entity | null> {
    const { data } = await this.client
      .from('[entities]')
      .select(`*, customer:customers!customer_id(id, name, email)`)
      .eq('id', id)
      .single();
    return data ? this.toEntity(data) : null;
  }

  // LIST with filters & pagination
  async findMany(filters: FiltersDTO, page: number, pageSize: number): Promise<ListResponse> {
    let query = this.client.from('[entities]').select('*', { count: 'exact' });
    query = this.applyFilters(query, filters);
    query = query.order(this.mapSortColumn(filters.sortBy), { ascending: filters.sortOrder === 'asc' });
    query = query.range((page - 1) * pageSize, page * pageSize - 1);
    const { data, count } = await query;
    return { items: data.map(this.toListItemDTO), pagination: { page, total: count, ... } };
  }

  // UPDATE
  async update(id: string, data: UpdateDTO): Promise<Result<Entity>> {
    const { error } = await this.client
      .from('[entities]')
      .update(this.toUpdateRow(data))
      .eq('id', id);
    if (error) return err(this.mapError(error));
    return this.findById(id).then(e => e ? ok(e) : err('Not found'));
  }

  // DELETE (soft)
  async softDelete(id: string): Promise<Result<void>> {
    const { error } = await this.client
      .from('[entities]')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    return error ? err(this.mapError(error)) : ok(undefined);
  }

  // MAPPERS
  private toEntity = (row): Entity => ({
    id: row.id,
    customerId: row.customer_id,        // snake → camel
    createdAt: new Date(row.created_at), // string → Date
  });

  private toInsertRow = (dto: CreateDTO): Insert => ({
    customer_id: dto.customerId,         // camel → snake
    status: 'DRAFT',
  });

  private toUpdateRow = (dto: UpdateDTO): Update => ({
    ...dto,
    updated_at: new Date().toISOString(),
  });

  private toListItemDTO = (row): ListItemDTO => ({
    id: row.id,
    status: row.status,
    createdAt: row.created_at,           // ISO string for DTO
  });

  private applyFilters(query, filters) {
    query = query.is('deleted_at', null);  // Always soft-delete filter
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.dateFrom) query = query.gte('created_at', filters.dateFrom.toISOString());
    if (filters.search) query = query.ilike('notes', `%${filters.search}%`);
    return query;
  }

  private mapError = (error): string => ({
    '23505': 'Record already exists',
    '23503': 'Referenced record not found',
    'PGRST116': 'Record not found',
  }[error.code] ?? error.message);
}
```

---

## R2 Storage Adapter

```typescript
class [Entity]R2Adapter implements [Entity]StoragePort {
  private readonly bucket = '[entities]';

  constructor(private readonly r2: R2Client) {}

  async uploadDocument(entityId: string, file: File, type: string): Promise<Result<string>> {
    const key = `[entities]/${entityId}/documents/${type}/${Date.now()}-${file.name}`;
    const result = await this.r2.upload({ bucket: this.bucket, key, body: file });
    return result.success ? ok(result.url) : err(result.error);
  }

  async getDocumentUrl(entityId: string, type: string): Promise<string | null> {
    const files = await this.r2.list({ prefix: `[entities]/${entityId}/documents/${type}/` });
    if (!files.keys.length) return null;
    return this.r2.getPresignedUrl({ key: files.keys[0], expiresIn: 3600 });
  }

  async deleteAllFiles(entityId: string): Promise<Result<void>> {
    return this.r2.deleteByPrefix({ prefix: `[entities]/${entityId}/` });
  }
}
```

**Key Pattern:** `{entity}/{id}/{type}/{category}/{timestamp}-{filename}`

---

## KV Cache Adapter

```typescript
class [Entity]KVAdapter implements [Entity]CachePort {
  private readonly ns = '[entities]';
  private readonly ttl = { detail: 300, list: 60, count: 120 };

  constructor(private readonly kv: KVClient) {}

  async getDetail(id: string): Promise<Entity | null> {
    return this.kv.get(`${this.ns}:detail:${id}`);
  }

  async setDetail(entity: Entity): Promise<void> {
    await this.kv.set(`${this.ns}:detail:${entity.id}`, entity, { ttl: this.ttl.detail });
  }

  async invalidateForEntity(id: string): Promise<void> {
    await Promise.all([
      this.kv.delete(`${this.ns}:detail:${id}`),
      this.kv.deleteByPrefix(`${this.ns}:list:`),
      this.kv.deleteByPrefix(`${this.ns}:count:`),
    ]);
  }
}
```

**Key Pattern:** `{namespace}:{type}:{id}`

---

## Quick Reference

### Mapper Transformations

| Direction   | Transformation                                |
| ----------- | --------------------------------------------- |
| DB → Entity | `snake_case` → `camelCase`, `string` → `Date` |
| Entity → DB | `camelCase` → `snake_case`, add `updated_at`  |
| DB → DTO    | Minimal fields, dates as ISO strings          |

### Error Codes

| Postgres   | Message                     |
| ---------- | --------------------------- |
| `23505`    | Record already exists       |
| `23503`    | Referenced record not found |
| `23502`    | Required field missing      |
| `PGRST116` | Record not found            |

### Return Types

| Operation            | Return                      |
| -------------------- | --------------------------- |
| Create/Update/Delete | `Result<T>`                 |
| FindById             | `T \| null`                 |
| FindMany             | `ListResponse` (never null) |
