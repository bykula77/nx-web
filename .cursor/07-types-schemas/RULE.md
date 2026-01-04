---
description: 'Type definitions pattern: entity, enum, schema, DTO, constants.'
alwaysApply: false
globs: ['packages/domains/**/types/**/*']
---

# Types & Schemas Pattern

**Trigger:** Creating/editing domain type files

## Structure & Order

```
types/
├── [domain].entity.ts      # 1. No domain imports
├── [domain].enums.ts       # 2. No domain imports
├── [domain].schemas.ts     # 3. Imports enums
├── [domain].dto.ts         # 4. Imports schemas, enums, entity
├── [domain].constants.ts   # 5. Imports enums
└── index.ts                # 6. Exports all
```

---

## Entity

```typescript
interface [Entity] {
  id: string;
  customerId: string;        // Foreign ref: ID only, NEVER embed entity
  status: [Entity]Status;
  items: [Entity]Item[];     // Child entities
  address: Address;          // Value object
  total: number;
  notes?: string;            // Optional: use ?
  deletedAt: Date | null;    // Nullable: use | null
  createdAt: Date;
  updatedAt: Date;
}

interface [Entity]Item { id: string; productId: string; quantity: number; }
interface Address { street: string; city: string; }  // Value object: no ID
```

| Rule            | Pattern            |
| --------------- | ------------------ |
| Use `interface` | Not `type`         |
| IDs as `string` | UUID format        |
| Dates as `Date` | In entity          |
| Optional        | `field?: T`        |
| Nullable        | `field: T \| null` |
| No methods      | Pure data          |

---

## Enums

```typescript
enum [Entity]Status {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

enum [Entity]Type {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
}
```

| Rule            | ✅                    | ❌                |
| --------------- | --------------------- | ----------------- |
| String values   | `PENDING = 'PENDING'` | `PENDING = 1`     |
| Key = Value     | `DRAFT = 'DRAFT'`     | `DRAFT = 'draft'` |
| SCREAMING_SNAKE | `CASH_ON_DELIVERY`    | `CashOnDelivery`  |

---

## Zod Schemas

```typescript
// Reusable
const AddressSchema = z.object({
  street: z.string().min(1, 'Street required'),
  city: z.string().min(1, 'City required'),
});

// Command (mutation)
const Create[Entity]Schema = z.object({
  customerId: z.string().uuid('Invalid ID'),
  type: z.nativeEnum([Entity]Type).default(Type.STANDARD),
  items: z.array(ItemSchema).min(1, 'At least one item'),
  notes: z.string().max(500).optional(),
});

const Update[Entity]Schema = Create[Entity]Schema.partial().omit({ customerId: true });

// Query (read)
const List[Entities]QuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().min(10).max(100).default(20),
  status: z.nativeEnum(Status).optional(),
  dateFrom: z.coerce.date().optional(),
  sortBy: z.enum(['createdAt', 'total']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
```

| Pattern              | Usage                          |
| -------------------- | ------------------------------ |
| `z.nativeEnum(Enum)` | TypeScript enums               |
| `z.enum(['a', 'b'])` | String literals                |
| `z.coerce.number()`  | Query params (string → number) |
| `.default(value)`    | Optional with fallback         |
| `.min(1, 'message')` | Descriptive errors             |

---

## DTOs

```typescript
// Request: INFER from Zod
type Create[Entity]DTO = z.infer<typeof Create[Entity]Schema>;
type List[Entities]QueryDTO = z.infer<typeof List[Entities]QuerySchema>;

// Response: MANUAL definition, dates as ISO strings
interface [Entity]ListItemDTO {
  id: string;
  status: Status;
  total: number;
  createdAt: string;  // ISO string
}

interface [Entity]DetailDTO {
  id: string;
  status: Status;
  items: ItemDTO[];
  customer: CustomerRefDTO;  // Embedded relation
  createdAt: string;
}

interface [Entity]ListResponseDTO {
  items: [Entity]ListItemDTO[];
  pagination: { page: number; total: number; hasNext: boolean; };
}
```

| Type         | Definition         | Dates      |
| ------------ | ------------------ | ---------- |
| Request DTO  | `z.infer<>`        | N/A        |
| Response DTO | Manual `interface` | ISO string |

---

## Constants

```typescript
// Business rules
const [ENTITY]_CONSTANTS = {
  MIN_AMOUNT: 10,
  MAX_ITEMS: 50,
  TAX_RATE: 0.18,
  DEFAULT_PAGE_SIZE: 20,
} as const;

// Display labels
const [ENTITY]_STATUS_LABELS: Record<Status, string> = {
  [Status.DRAFT]: 'Draft',
  [Status.PENDING]: 'Pending',
};

// UI colors (Ant Design)
const [ENTITY]_STATUS_COLORS: Record<Status, string> = {
  [Status.DRAFT]: 'default',
  [Status.PENDING]: 'warning',
};

// State machine
const [ENTITY]_STATUS_TRANSITIONS: Record<Status, Status[]> = {
  [Status.DRAFT]: [Status.PENDING, Status.CANCELLED],
  [Status.PENDING]: [Status.COMPLETED, Status.CANCELLED],
};

// Query keys (React Query)
const [ENTITY]_QUERY_KEYS = {
  all: ['[entities]'] as const,
  list: (filters: object) => [...QUERY_KEYS.all, 'list', filters] as const,
  detail: (id: string) => [...QUERY_KEYS.all, 'detail', id] as const,
};
```

---

## Index Exports

```typescript
// Type-only (entities, DTOs)
export type { [Entity], [Entity]Item, Create[Entity]DTO, [Entity]DetailDTO } from './...';

// Value exports (enums, schemas, constants)
export { [Entity]Status, Create[Entity]Schema, [ENTITY]_CONSTANTS } from './...';
```

| Type                  | Export            |
| --------------------- | ----------------- |
| Entity/DTO            | `export type { }` |
| Enum/Schema/Constants | `export { }`      |
