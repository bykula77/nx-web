---
description: 'Vertical Slice implementation pattern. 6-file structure for use-cases.'
alwaysApply: false
globs: ['packages/domains/**/slices/**/*']
---

# Vertical Slice Pattern

**Trigger:** Creating features, CRUD operations, business actions

## Structure (MANDATORY 6 FILES)

```
slices/[action-entity]/
├── [action-entity].command.ts   # Zod schema + inferred type
├── [action-entity].handler.ts   # Pure function, DI, Result<T>
├── [action-entity].rules.ts     # Business validation
├── use[ActionEntity].ts         # React Query hook
├── [ActionEntity]Form.tsx       # UI component
└── index.ts                     # Public exports
```

## Data Flow

```
Form → Hook → Handler → Rules → Adapter (via Port)
         ↓
   Command (Input)
```

---

## File Templates

### 1. Command

```typescript
// [action-entity].command.ts
import { z } from 'zod';

export const Create[Entity]CommandSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
  notes: z.string().max(500).optional(),
});

// ALWAYS infer type from schema
export type Create[Entity]Command = z.infer<typeof Create[Entity]CommandSchema>;
```

### 2. Handler

```typescript
// [action-entity].handler.ts
interface Dependencies {
  repository: [Entity]RepositoryPort;  // Injected, never imported
}

type [Action]Error =
  | { type: 'VALIDATION_ERROR'; messages: string[] }
  | { type: 'BUSINESS_RULE_ERROR'; messages: string[] }
  | { type: 'PERSISTENCE_ERROR'; message: string };

async function handle[Action](
  command: Command,
  deps: Dependencies
): Promise<Result<[Entity], [Action]Error>> {
  // 1. Schema validation
  const parsed = Schema.safeParse(command);
  if (!parsed.success) return err({ type: 'VALIDATION_ERROR', messages: [...] });

  // 2. Business rules
  const rules = validateRules(parsed.data);
  if (!rules.valid) return err({ type: 'BUSINESS_RULE_ERROR', messages: rules.errors });

  // 3. Business logic / calculations
  const processed = { ...parsed.data, total: calculateTotal(...) };

  // 4. Persist via port
  const result = await deps.repository.create(processed);
  if (!result.success) return err({ type: 'PERSISTENCE_ERROR', message: result.error });

  return ok(result.data);
}
```

### 3. Rules

```typescript
// [action-entity].rules.ts
interface RulesResult { valid: boolean; errors: string[]; }

function validate[Action]Rules(command: Command): RulesResult {
  const errors: string[] = [];

  if (total < MIN_AMOUNT) errors.push('Minimum amount required');
  if (items.length > MAX_ITEMS) errors.push('Too many items');
  if (hasDuplicates(items)) errors.push('Duplicate products');

  return { valid: errors.length === 0, errors };
}

// Individual checks for UI feedback
function canAddMoreItems(count: number): boolean { return count < MAX_ITEMS; }
function isMinimumMet(total: number): boolean { return total >= MIN_AMOUNT; }
```

### 4. Hook

```typescript
// use[ActionEntity].ts
interface UseOptions {
  onSuccess?: (entity: [Entity]) => void;
  onError?: (error: [Action]Error) => void;
  showNotifications?: boolean;
}

function use[Action](options: UseOptions = {}) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (command: Command) => {
      const result = await handle[Action](command, {
        repository: new [Entity]SupabaseAdapter(supabase),
      });
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: (entity) => {
      queryClient.invalidateQueries({ queryKey: ['[entities]'] });
      if (options.showNotifications !== false) notification.success({ ... });
      options.onSuccess?.(entity);
    },
    onError: (error) => {
      if (options.showNotifications !== false) notification.error({ ... });
      options.onError?.(error);
    },
  });
}
```

### 5. UI Component

```typescript
// [ActionEntity]Form.tsx
interface Props {
  customerId: string;
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
}

function [Action]Form({ customerId, onSuccess, onCancel }: Props) {
  const [form] = Form.useForm<Command>();
  const mutation = use[Action]({ onSuccess: (e) => onSuccess?.(e.id) });
  const items = Form.useWatch('items', form) ?? [];

  // Use rules for UI feedback
  const total = calculateTotal(items);
  const canSubmit = isMinimumMet(total);

  return (
    <Form form={form} onFinish={(v) => mutation.mutate({ ...v, customerId })} disabled={mutation.isPending}>
      {/* Form fields */}
      <Button type="primary" htmlType="submit" loading={mutation.isPending} disabled={!canSubmit}>
        Create
      </Button>
    </Form>
  );
}
```

### 6. Index

```typescript
// index.ts
export { use[Action] } from './use[ActionEntity]';
export type { UseOptions } from './use[ActionEntity]';
export { [Action]Form } from './[ActionEntity]Form';
export type { Command } from './[action-entity].command';
export type { [Action]Error } from './[action-entity].handler';
export { canAddMoreItems, isMinimumMet } from './[action-entity].rules';
```

---

## Slice Variants

### Query Slice (list/get)

```
list-[entities]/
├── list-[entities].query.ts      # Filters schema
├── useList[Entities].ts          # useQuery hook
├── [Entities]Table.tsx
└── index.ts
```

```typescript
// useList[Entities].ts
function useList[Entities](query: Query) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['[entities]', 'list', query],
    queryFn: () => new Adapter(supabase).findMany(query),
    placeholderData: keepPreviousData,
  });
}
```

### Action Slice (cancel/approve/assign)

```
cancel-[entity]/
├── cancel-[entity].command.ts
├── cancel-[entity].handler.ts
├── cancel-[entity].rules.ts
├── useCancel[Entity].ts
├── Cancel[Entity]Button.tsx      # Trigger + Modal
└── index.ts
```

---

## Key Rules

| Aspect  | Rule                                                        |
| ------- | ----------------------------------------------------------- |
| Command | Zod schema first, infer type                                |
| Handler | Pure function, DI, `Result<T,E>`, NEVER throw               |
| Rules   | Business validation, export individual checks for UI        |
| Hook    | Instantiate adapter, invalidate cache, handle notifications |
| UI      | Use hook + rules, props for callbacks                       |
| Index   | Export hook, UI, types (type-only), rule utilities          |

## Validation Split

| Where            | What                                           |
| ---------------- | ---------------------------------------------- |
| Schema (command) | Format, required, type constraints             |
| Rules            | Business logic, cross-field, limits            |
| Handler          | State-based (e.g., can only cancel if pending) |
