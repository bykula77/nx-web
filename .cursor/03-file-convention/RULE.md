---
description: 'File naming conventions and barrel export rules. MUST be followed exactly.'
alwaysApply: true
---

# File Conventions

## Naming Rules (ENFORCED)

| Element             | Convention                    | Example                            |
| ------------------- | ----------------------------- | ---------------------------------- |
| Domain/Slice folder | `kebab-case`                  | `order/`, `create-order/`          |
| Logic file          | `[name].[suffix].ts`          | `create-order.handler.ts`          |
| Hook                | `use[Action].ts`              | `useCreateOrder.ts`                |
| Component           | `[Action]Form.tsx`            | `CreateOrderForm.tsx`              |
| Test                | `[slice].integration.test.ts` | `create-order.integration.test.ts` |
| Index               | `index.ts`                    | Barrel exports ONLY                |

---

## File Suffixes

### Types (`domains/[domain]/src/types/`)

| Suffix          | Purpose                |
| --------------- | ---------------------- |
| `.entity.ts`    | Core entity interface  |
| `.enums.ts`     | Enum definitions       |
| `.schemas.ts`   | Zod validation         |
| `.dto.ts`       | Request/Response types |
| `.constants.ts` | Business constants     |

### Slices (`domains/[domain]/src/slices/[action]/`)

| Suffix        | Purpose                 |
| ------------- | ----------------------- |
| `.command.ts` | Input type + Zod schema |
| `.handler.ts` | Business logic          |
| `.rules.ts`   | Business validation     |

### Infrastructure

| Suffix         | Location              | Purpose              |
| -------------- | --------------------- | -------------------- |
| `.port.ts`     | `ports/`              | Dependency interface |
| `.adapter.ts`  | `adapters/`           | Port implementation  |
| `.fixture.ts`  | `__tests__/fixtures/` | Test data factory    |
| `.handlers.ts` | `__tests__/mocks/`    | MSW handlers         |

### Shared (`shared/src/`)

| Suffix          | Purpose            |
| --------------- | ------------------ |
| `.utils.ts`     | Utility functions  |
| `.types.ts`     | Type definitions   |
| `.constants.ts` | App-wide constants |

---

## Slice Naming

**Pattern:** `[action]-[entity]` (action first)

| Category | Examples                                                                               |
| -------- | -------------------------------------------------------------------------------------- |
| CRUD     | `create-order`, `list-orders`, `get-order-details`, `update-order`, `delete-order`     |
| Bulk     | `bulk-create-orders`, `import-products`, `export-orders`                               |
| Business | `cancel-order`, `approve-request`, `assign-ticket`, `complete-lesson`, `archive-order` |

---

## Slice Structure (MANDATORY)

```
slices/[action-entity]/
├── [action-entity].command.ts
├── [action-entity].handler.ts
├── [action-entity].rules.ts
├── use[ActionEntity].ts
├── [ActionEntity]Form.tsx
└── index.ts
```

**Optional files:** `[Action]Modal.tsx`, `[Action]Button.tsx`, `[Action]Table.tsx`, `[Action]Filters.tsx`

---

## Barrel Export Rules (ENFORCED)

> ⛔ index.ts = ONLY exports. No logic, no implementation.

### Slice index.ts

```typescript
// ✅ Selective exports
export { useCreateOrder } from './useCreateOrder';
export { CreateOrderForm } from './CreateOrderForm';
export type { CreateOrderCommand } from './create-order.command';

// ❌ NEVER re-export everything
export * from './create-order.handler';
```

### Export Visibility

| File           | Export?                   |
| -------------- | ------------------------- |
| `*.command.ts` | Type only (`export type`) |
| `*.handler.ts` | ❌ Internal               |
| `*.rules.ts`   | ❌ Internal               |
| `use*.ts`      | ✅ Named                  |
| `*.tsx`        | ✅ Named                  |

---

## Page Naming

**Pattern:** `[Domain][Action]Page.tsx`

| Domain | List            | Show            | Create            | Edit            |
| ------ | --------------- | --------------- | ----------------- | --------------- |
| order  | `OrderListPage` | `OrderShowPage` | `OrderCreatePage` | `OrderEditPage` |

---

## Forbidden Patterns (BLOCKING)

| ❌ Forbidden                  | ✅ Correct                         |
| ----------------------------- | ---------------------------------- |
| Logic in `index.ts`           | Dedicated file                     |
| Multiple components per file  | Separate files                     |
| Tests in slice folder         | `__tests__/integration/`           |
| Generic names (`utils.ts`)    | Specific (`order.calculations.ts`) |
| Numbered files (`v2`, `_new`) | Descriptive names                  |
