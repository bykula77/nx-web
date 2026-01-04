---
description: 'Domain module creation guide with templates.'
alwaysApply: false
globs: ['packages/domains/**/*']
---

# Domain Module Pattern

**Trigger:** Creating/extending domain modules

## Implementation Order (STRICT)

| Step | Files                                                  | Depends On       |
| ---- | ------------------------------------------------------ | ---------------- |
| 1    | `package.json`, `tsconfig.json`                        | —                |
| 2    | `types/[domain].entity.ts`                             | —                |
| 3    | `types/[domain].enums.ts`                              | —                |
| 4    | `types/[domain].schemas.ts`                            | Entity, Enums    |
| 5    | `types/[domain].dto.ts`                                | Schemas          |
| 6    | `types/[domain].constants.ts`                          | Enums            |
| 7    | `types/index.ts`                                       | All types        |
| 8    | `ports/[domain].repository.port.ts`                    | Types            |
| 9    | `ports/[domain].service.port.ts`                       | Types            |
| 10   | `adapters/[domain].supabase.adapter.ts`                | Ports            |
| 11   | `adapters/[domain].storage.adapter.ts`                 | Ports (optional) |
| 12   | `shared/[domain].{calculations,formatters,mappers}.ts` | Types            |
| 13   | `index.ts`                                             | All modules      |

---

## Templates

### Entity

```typescript
// types/[domain].entity.ts
interface [Domain] {
  id: string;
  customerId: string;           // Foreign ID only, NEVER embed entity
  status: [Domain]Status;
  items: [Domain]Item[];
  createdAt: Date;
  updatedAt: Date;
}

interface [Domain]Item { id: string; productId: string; quantity: number; }
```

### Enums

```typescript
// types/[domain].enums.ts
enum [Domain]Status {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Optional: status transitions
const STATUS_TRANSITIONS: Record<Status, Status[]> = { ... };
```

### Schemas (Zod)

```typescript
// types/[domain].schemas.ts
const Create[Domain]Schema = z.object({
  customerId: z.string().uuid(),
  items: z.array(ItemSchema).min(1),
});

const Update[Domain]Schema = Create[Domain]Schema.partial();
const [Domain]FiltersSchema = z.object({ status: z.nativeEnum(Status).optional() });
```

### DTOs

```typescript
// types/[domain].dto.ts
type Create[Domain]DTO = z.infer<typeof Create[Domain]Schema>;  // Request: infer from Zod
interface [Domain]ListItemDTO { id: string; status: Status; }   // Response: explicit
interface [Domain]ListResponseDTO { items: ListItemDTO[]; total: number; hasMore: boolean; }
```

### Constants

```typescript
// types/[domain].constants.ts
const [DOMAIN]_CONSTANTS = { MIN_AMOUNT: 10, MAX_ITEMS: 50 } as const;
const [DOMAIN]_STATUS_LABELS: Record<Status, string> = { DRAFT: 'Draft', ... };
const [DOMAIN]_STATUS_COLORS: Record<Status, string> = { DRAFT: 'default', ... };
```

### Repository Port

```typescript
// ports/[domain].repository.port.ts
interface [Domain]RepositoryPort {
  // Commands → Result<T>
  create(data: CreateDTO): Promise<Result<[Domain]>>;
  update(id: string, data: UpdateDTO): Promise<Result<[Domain]>>;
  delete(id: string): Promise<Result<void>>;

  // Queries → nullable or list
  findById(id: string): Promise<[Domain] | null>;
  findMany(filters: FiltersDTO, page: number): Promise<ListResponseDTO>;
}
```

### Service Ports

```typescript
// ports/[domain].service.port.ts
interface [Domain]NotificationPort {
  sendConfirmation(id: string, email: string): Promise<Result<void>>;
}

interface [Domain]StoragePort {
  upload(id: string, file: File): Promise<Result<string>>;
  getUrl(id: string): Promise<string | null>;
}
```

### Supabase Adapter

```typescript
// adapters/[domain].supabase.adapter.ts
class [Domain]SupabaseAdapter implements [Domain]RepositoryPort {
  constructor(private client: SupabaseClient) {}

  async create(data: CreateDTO): Promise<Result<[Domain]>> {
    const { data: row, error } = await this.client
      .from('[domains]')
      .insert(this.toRow(data))
      .select()
      .single();
    if (error) return err(error.message);
    return ok(this.toEntity(row));
  }

  async findById(id: string): Promise<[Domain] | null> {
    const { data } = await this.client
      .from('[domains]')
      .select('*, items:[domain]_items(*)')
      .eq('id', id)
      .single();
    return data ? this.toEntity(data) : null;
  }

  async findMany(filters: FiltersDTO, page: number): Promise<ListResponseDTO> {
    let query = this.client.from('[domains]').select('*', { count: 'exact' });
    if (filters.status) query = query.eq('status', filters.status);
    // ... pagination, ordering
    return { items, total, hasMore };
  }

  // Mappers: toRow(), toEntity(), toListItem()
}
```

### Shared Utilities

```typescript
// shared/[domain].calculations.ts
function calculateTotal(items: Item[]): number { ... }
function isMinimumMet(total: number): boolean { ... }

// shared/[domain].formatters.ts
function formatStatus(status: Status): string { return LABELS[status]; }
function getStatusColor(status: Status): string { return COLORS[status]; }

// shared/[domain].mappers.ts
function toListItem(entity: [Domain]): ListItemDTO { ... }
```

### Domain Index (Public API)

```typescript
// index.ts
// Types (selective)
export type { [Domain], Create[Domain]DTO, [Domain]ListResponseDTO } from './types';
export { [Domain]Status, [DOMAIN]_CONSTANTS, Create[Domain]Schema } from './types';

// Slices (as created)
export { useCreate[Domain], Create[Domain]Form } from './slices/create-[domain]';

// Shared utilities
export { calculateTotal, formatStatus } from './shared';

// Adapters (for DI)
export { [Domain]SupabaseAdapter } from './adapters';

// Ports (for testing)
export type { [Domain]RepositoryPort } from './ports';
```

---

## Key Patterns

| Pattern             | Rule                                    |
| ------------------- | --------------------------------------- | ------------- |
| Entity foreign refs | ID only, NEVER embed foreign entity     |
| Commands            | Return `Result<T>`                      |
| Queries             | Return `T                               | null` or list |
| Enums               | String values, SCREAMING_SNAKE_CASE     |
| Request DTOs        | Infer from Zod                          |
| Response DTOs       | Explicit interface                      |
| Adapter mappers     | `toRow()`, `toEntity()`, `toListItem()` |

---

## Optional Files

| File                          | When                         |
| ----------------------------- | ---------------------------- |
| `[domain].storage.adapter.ts` | File uploads needed          |
| `[domain].service.port.ts`    | External service integration |
| Status transitions map        | Complex workflow states      |
