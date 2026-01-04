---
description: 'Turborepo + Vertical Slice + DDD implementation guide'
alwaysApply: true
---

# Implementation Guide

## Context

- **Stack:** Turborepo/pnpm, Supabase, Cloudflare R2/KV
- **Apps:** backoffice, client-panel, web
- **Packages:** domains/_, providers/_, ui/_, shared/_

## Execution Order (BLOCKING)

```
1.ANALYSIS → 2.FOUNDATION → 3.SLICES → 4.INTEGRATION → 5.TESTING
```

> ⛔ NEVER skip phases. Complete each before proceeding.

---

## Phase 1: Analysis

Before coding, extract:

```yaml
domain: { name, status: new|existing }
slices: [verb-entity, ...] # create-order, list-users, cancel-subscription
integrations:
  providers: [{ name, exists: bool }]
  cross_domain: { reads: [domain:field], triggers: [domain:action] }
```

---

## Phase 2: Foundation

Execute in order:

### Structure

```
packages/domains/[domain]/
├── src/{types,slices,shared,ports,adapters}/
├── __tests__/{fixtures,mocks,integration}/
└── package.json  # @workspace/domain-[name]
```

### Files (ordered)

| #   | Types            | Ports              | Adapters            | Shared          |
| --- | ---------------- | ------------------ | ------------------- | --------------- |
| 1   | entity.ts        | repository.port.ts | supabase.adapter.ts | calculations.ts |
| 2   | enums.ts         | service.port.ts    | storage.adapter.ts  | formatters.ts   |
| 3   | schemas.ts (zod) |                    | cache.adapter.ts    | mappers.ts      |
| 4   | dto.ts           |                    |                     |                 |
| 5   | constants.ts     |                    |                     |                 |

✓ Verify: types compile, ports define methods, adapters implement ports, no circular deps

---

## Phase 3: Slices

> ⚠️ Implement ONE slice end-to-end, TEST, then expand.

### Slice Structure (6 files)

```
slices/[action-entity]/
├── [action-entity].command.ts   # Zod schema + type
├── [action-entity].rules.ts     # Business validators
├── [action-entity].handler.ts   # Logic (deps injection)
├── use[ActionEntity].ts         # React Query hook
├── [ActionEntity]Form.tsx       # UI
└── index.ts
```

### Priority

`create-*` → `list-*` → `get-*-details` → `update-*` → `delete-*` → business actions

### Handler Pattern

```typescript
async function handle[Action](command, deps: {repository: Port}): Promise<Result<T>> {
  const parsed = Schema.safeParse(command);        // 1. Schema
  if (!parsed.success) return {success:false, error};
  const rules = validateRules(parsed.data);        // 2. Rules
  if (!rules.isValid) return {success:false, error};
  return deps.repository.execute(parsed.data);     // 3. Execute
}
```

✓ Verify: slice compiles, hook works, UI submits, data persists

---

## Phase 4: Integration

### Pages

```
apps/[app]/src/pages/[domain]/
  {List,Show,Create,Edit}Page.tsx
```

### Cross-Domain (CRITICAL)

```typescript
// ✅ Orchestration ONLY at app layer (pages)
// ❌ Domains NEVER import other domains
const handleSubmit = async (data) => {
  const order = await createOrder(data);
  await createInvoice({ orderId: order.id });
  await sendNotification({ type: 'ORDER_CREATED', orderId });
};
```

---

## Phase 5: Testing

```
__tests__/
├── fixtures/[domain].fixture.ts
├── mocks/[domain].handlers.ts  # MSW
└── integration/[action].test.ts, [domain]-workflow.test.ts
```

Cover: happy path, rules, edge cases, errors, workflows

---

## Decision Trees

### Code Placement

```
Business logic? → Reusable? → shared/ : slices/handler
UI component? → Domain-specific? → slices/ : packages/ui/
External wrapper? → providers/ : shared/
```

### New vs Extend Domain

```
Entity belongs to existing concept? → Extend (add types + slices) : New domain
```

---

## Anti-Patterns (BLOCKING)

| ❌ Wrong                                    | ✅ Right                                         |
| ------------------------------------------- | ------------------------------------------------ |
| Page → Hook → Handler                       | Types → Ports → Adapters → Handler → Hook → Page |
| `import {X} from '@workspace/domain-other'` | Join at query or pass IDs                        |
| Business logic in pages                     | Rules in handler                                 |
| Direct adapter usage                        | Dependency injection via port                    |
| All slices → then test                      | 1 slice → test → verify → expand                 |

---

## Task Sizing

| Size | Scope                   | Sessions                                     |
| ---- | ----------------------- | -------------------------------------------- |
| S    | 1-2 slices              | 1 (slice → page → test)                      |
| M    | 3-5 slices, 1 domain    | 4 (foundation → core → rest → integration)   |
| L    | 5+ slices, multi-domain | 7 (analysis → domains → integration → tests) |

---

## Commands

```bash
# Generate
mkdir -p packages/domains/[name]/{src/{types,slices,shared,ports,adapters},__tests__/{fixtures,mocks,integration}}

# Build/Test
turbo run build --filter=@workspace/domain-[name]
turbo run test --filter=@workspace/domain-[name]
```
