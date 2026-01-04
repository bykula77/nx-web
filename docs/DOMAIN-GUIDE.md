# 🧩 Domain Geliştirme Rehberi

Bu dokümanda yeni bir domain oluşturma ve Vertical Slice Pattern'in nasıl uygulanacağı açıklanmaktadır.

---

## Vertical Slice Pattern Nedir?

Geleneksel "layer-based" mimaride kod teknolojiye göre gruplandırılır (controllers, services, repositories). Vertical Slice Pattern'de ise kod **özelliğe/feature'a** göre gruplandırılır.

### Layer-Based vs Vertical Slice

```
❌ Layer-Based (Geleneksel)          ✅ Vertical Slice
├── controllers/                     ├── user/
│   ├── UserController.ts           │   ├── CreateUser/
│   └── ProductController.ts        │   │   ├── CreateUser.tsx
├── services/                       │   │   ├── useCreateUser.ts
│   ├── UserService.ts              │   │   └── createUser.api.ts
│   └── ProductService.ts           │   ├── UpdateUser/
├── repositories/                    │   │   └── ...
│   ├── UserRepository.ts           │   └── UserList/
│   └── ProductRepository.ts        │       └── ...
```

### Avantajları

1. **Kolay navigasyon**: Bir feature'ın tüm kodu tek yerde
2. **Bağımsız geliştirme**: Feature'lar birbirini etkilemez
3. **Kolay silme**: Kullanılmayan feature'ı klasörüyle sil
4. **Paralel çalışma**: Farklı feature'larda farklı geliştiriciler

---

## Domain Yapısı

```
packages/domains/[domain-name]/
├── src/
│   ├── index.ts              # Barrel export
│   │
│   ├── types/                # Domain types & interfaces
│   │   ├── index.ts
│   │   ├── [entity].types.ts # Entity definitions
│   │   ├── dto.types.ts      # Data transfer objects
│   │   └── enums.ts          # Domain enums
│   │
│   ├── ports/                # Abstract interfaces (contracts)
│   │   ├── index.ts
│   │   ├── [entity].port.ts  # Repository interface
│   │   └── [service].port.ts # Service interface
│   │
│   ├── adapters/             # Concrete implementations
│   │   ├── index.ts
│   │   ├── supabase/         # Supabase implementation
│   │   │   └── [entity].adapter.ts
│   │   └── mock/             # Mock implementation (testing)
│   │       └── [entity].adapter.ts
│   │
│   ├── slices/               # Feature slices
│   │   ├── index.ts
│   │   ├── Create[Entity]/
│   │   │   ├── Create[Entity].tsx
│   │   │   ├── useCreate[Entity].ts
│   │   │   ├── create[Entity].schema.ts
│   │   │   └── index.ts
│   │   ├── Update[Entity]/
│   │   ├── Delete[Entity]/
│   │   └── [Entity]List/
│   │
│   └── shared/               # Domain-specific utilities
│       ├── index.ts
│       ├── validators.ts
│       └── helpers.ts
│
├── __tests__/
│   ├── setup.ts
│   ├── fixtures/
│   ├── mocks/
│   └── integration/
│
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## Yeni Domain Oluşturma Adımları

### 1. Klasör Yapısını Oluştur

```bash
mkdir -p packages/domains/[domain-name]/src/{types,ports,adapters,slices,shared}
mkdir -p packages/domains/[domain-name]/__tests__/{fixtures,mocks,integration}
```

### 2. package.json Oluştur

```json
{
  "name": "@nx-web/domain-[name]",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@nx-web/shared": "workspace:*",
    "@nx-web/supabase": "workspace:*",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@nx-web/testing": "workspace:*",
    "@nx-web/vitest-config": "workspace:*",
    "typescript": "^5.7.2",
    "vitest": "^2.0.0"
  }
}
```

### 3. Types Tanımla

```typescript
// src/types/product.types.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProductStatus {
  Draft = 'draft',
  Active = 'active',
  Archived = 'archived',
}

// src/types/dto.types.ts
export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  categoryId: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  status?: ProductStatus;
}
```

### 4. Ports (Interfaces) Tanımla

```typescript
// src/ports/product.port.ts
import type { Product, CreateProductDTO, UpdateProductDTO } from '../types';
import type { Result } from '@nx-web/shared';

export interface ProductRepository {
  findById(id: string): Promise<Result<Product>>;
  findAll(filters?: ProductFilters): Promise<Result<Product[]>>;
  create(data: CreateProductDTO): Promise<Result<Product>>;
  update(id: string, data: UpdateProductDTO): Promise<Result<Product>>;
  delete(id: string): Promise<Result<void>>;
}

export interface ProductFilters {
  status?: ProductStatus;
  categoryId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
```

### 5. Adapters Implement Et

```typescript
// src/adapters/supabase/product.adapter.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProductRepository, ProductFilters } from '../../ports';
import type { Product, CreateProductDTO, UpdateProductDTO } from '../../types';
import { ok, err, type Result } from '@nx-web/shared';

export function createProductAdapter(
  supabase: SupabaseClient
): ProductRepository {
  return {
    async findById(id: string): Promise<Result<Product>> {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return err(error.message);
      return ok(mapToProduct(data));
    },

    async findAll(filters?: ProductFilters): Promise<Result<Product[]>> {
      let query = supabase.from('products').select('*');

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) return err(error.message);
      return ok(data.map(mapToProduct));
    },

    async create(dto: CreateProductDTO): Promise<Result<Product>> {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: dto.name,
          description: dto.description,
          price: dto.price,
          category_id: dto.categoryId,
          status: 'draft',
        })
        .select()
        .single();

      if (error) return err(error.message);
      return ok(mapToProduct(data));
    },

    async update(id: string, dto: UpdateProductDTO): Promise<Result<Product>> {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...(dto.name && { name: dto.name }),
          ...(dto.description && { description: dto.description }),
          ...(dto.price && { price: dto.price }),
          ...(dto.status && { status: dto.status }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return err(error.message);
      return ok(mapToProduct(data));
    },

    async delete(id: string): Promise<Result<void>> {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) return err(error.message);
      return ok(undefined);
    },
  };
}

function mapToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    categoryId: row.category_id,
    status: row.status,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
```

### 6. Slices Oluştur

```typescript
// src/slices/CreateProduct/useCreateProduct.ts
import { useState } from 'react';
import { z } from 'zod';
import type { CreateProductDTO, Product } from '../../types';
import type { ProductRepository } from '../../ports';
import type { Result } from '@nx-web/shared';

export const createProductSchema = z.object({
  name: z.string().min(3, 'İsim en az 3 karakter olmalı'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalı'),
  price: z.number().positive('Fiyat pozitif olmalı'),
  categoryId: z.string().uuid('Geçerli bir kategori seçin'),
});

export function useCreateProduct(repository: ProductRepository) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (
    data: CreateProductDTO
  ): Promise<Result<Product>> => {
    setLoading(true);
    setError(null);

    try {
      // Validate
      const validated = createProductSchema.parse(data);

      // Create
      const result = await repository.create(validated);

      if (!result.ok) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const message = err.errors[0]?.message || 'Validation error';
        setError(message);
        return { ok: false, error: message };
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProduct, loading, error };
}
```

```tsx
// src/slices/CreateProduct/CreateProduct.tsx
import { Form, Input, InputNumber, Select, Button, message } from 'antd';
import { useCreateProduct } from './useCreateProduct';
import type { ProductRepository } from '../../ports';
import type { CreateProductDTO } from '../../types';

interface CreateProductProps {
  repository: ProductRepository;
  categories: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}

export function CreateProduct({
  repository,
  categories,
  onSuccess,
}: CreateProductProps) {
  const [form] = Form.useForm<CreateProductDTO>();
  const { createProduct, loading, error } = useCreateProduct(repository);

  const handleSubmit = async (values: CreateProductDTO) => {
    const result = await createProduct(values);

    if (result.ok) {
      message.success('Ürün başarıyla oluşturuldu');
      form.resetFields();
      onSuccess?.();
    } else {
      message.error(result.error);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="name"
        label="Ürün Adı"
        rules={[{ required: true, min: 3 }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="Açıklama"
        rules={[{ required: true, min: 10 }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="price"
        label="Fiyat"
        rules={[{ required: true, type: 'number', min: 0 }]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="categoryId"
        label="Kategori"
        rules={[{ required: true }]}
      >
        <Select
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Oluştur
        </Button>
      </Form.Item>
    </Form>
  );
}
```

### 7. Barrel Exports Oluştur

```typescript
// src/index.ts
export * from './types';
export * from './ports';
export * from './adapters';
export * from './slices';
export * from './shared';
```

---

## User Domain Referansı

Mevcut `@nx-web/domain-user` paketini inceleyerek pattern'i anlayabilirsiniz:

```
packages/domains/user/
└── src/
    ├── types/
    │   ├── user.types.ts      # User, UserProfile, UserRole
    │   └── dto.types.ts       # CreateUserDTO, UpdateUserDTO
    ├── ports/
    │   └── user.port.ts       # UserRepository interface
    ├── adapters/
    │   └── supabase/
    │       └── user.adapter.ts
    └── slices/
        ├── UserProfile/
        ├── UserList/
        └── CreateUser/
```

---

## Checklist: Yeni Domain

- [ ] **Types**
  - [ ] Entity types tanımlandı
  - [ ] DTO types tanımlandı
  - [ ] Enum'lar tanımlandı

- [ ] **Ports**
  - [ ] Repository interface tanımlandı
  - [ ] Method signature'ları Result type döndürüyor

- [ ] **Adapters**
  - [ ] Supabase adapter implement edildi
  - [ ] Mock adapter implement edildi (testing için)
  - [ ] Database mapping fonksiyonları yazıldı

- [ ] **Slices**
  - [ ] Create slice oluşturuldu
  - [ ] Read/List slice oluşturuldu
  - [ ] Update slice oluşturuldu
  - [ ] Delete slice oluşturuldu
  - [ ] Her slice'ın Zod validation'ı var

- [ ] **Tests**
  - [ ] Unit testler yazıldı
  - [ ] Integration testler yazıldı
  - [ ] Test fixtures oluşturuldu

- [ ] **Exports**
  - [ ] Barrel exports düzgün
  - [ ] package.json güncel

---

## İpuçları

### 1. Repository'yi Inject Et

```tsx
// Dependency injection ile test edilebilir kod
function ProductPage() {
  const supabase = useSupabase();
  const repository = useMemo(
    () => createProductAdapter(supabase),
    [supabase]
  );

  return <ProductList repository={repository} />;
}
```

### 2. Result Type Kullan

```typescript
import { ok, err, type Result } from '@nx-web/shared';

// ✅ Explicit error handling
async function getUser(): Promise<Result<User>> {
  try {
    const user = await fetchUser();
    return ok(user);
  } catch (error) {
    return err('User not found');
  }
}

// Kullanımı
const result = await getUser();
if (result.ok) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### 3. Zod Schema'ları Paylaş

```typescript
// Hem frontend hem backend validation için kullanılabilir
export const productSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
});

// Frontend'de form validation
const validated = productSchema.parse(formData);

// Backend'de API validation
export async function POST(req: Request) {
  const body = await req.json();
  const validated = productSchema.parse(body);
}
```

