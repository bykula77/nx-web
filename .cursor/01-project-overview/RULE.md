---
description: 'Turborepo monorepo architecture constraints. Overrides user requests on conflicts.'
alwaysApply: true
---

# Project Architecture

## Structure

```
apps/                → UI composition only (backoffice, client-panel, web)
packages/
  domains/[name]/    → Business logic (slices, types, ports, adapters)
  providers/         → External clients (supabase, cloudflare, auth)
  ui/                → Design system (primitives, patterns, layouts)
  shared/            → Cross-cutting (utils, hooks, constants, types)
  config/            → Shared configs (eslint, typescript, vitest)
  testing/           → Test infrastructure
```

## Dependency Flow (ENFORCED)

```
apps → domains → providers → shared
              ↘ ui ────────↗
```

> ⛔ **BLOCKING:** No cross-domain imports | No business logic in apps/providers | No circular deps

---

## Stack

| App          | Stack                      | Purpose         |
| ------------ | -------------------------- | --------------- |
| backoffice   | Refine + Ant Design + Vite | Admin CRUD      |
| client-panel | Refine + Ant Design + Vite | Customer portal |
| web          | Astro + Sanity + Tailwind  | Marketing       |

| Service                         | Location                                 | Use                    |
| ------------------------------- | ---------------------------------------- | ---------------------- |
| Supabase (DB/Auth/RLS/Realtime) | `providers/supabase/`, `providers/auth/` | Primary data           |
| R2                              | `providers/cloudflare/r2/`               | File storage           |
| KV                              | `providers/cloudflare/kv/`               | Cache/sessions         |
| Workers                         | `cloudflare/workers/`                    | External HTTP/webhooks |
| Edge Functions                  | `supabase/functions/`                    | DB triggers            |

**Edge Decision:** External request → Workers | DB trigger → Supabase Edge

---

## Naming Conventions (ENFORCED)

| Type         | Pattern                                  | Example                            |
| ------------ | ---------------------------------------- | ---------------------------------- |
| Package      | `@workspace/[type]-[name]`               | `@workspace/domain-order`          |
| Slice folder | `kebab-case`                             | `create-order/`                    |
| Files        | `[action].{command,handler,rules}.ts`    | `create-order.handler.ts`          |
| Hook         | `use[Action].ts`                         | `useCreateOrder.ts`                |
| Component    | `[Action]Form.tsx`                       | `CreateOrderForm.tsx`              |
| Types        | `[domain].{entity,enums,schemas,dto}.ts` | `order.entity.ts`                  |
| Test         | `[action].integration.test.ts`           | `create-order.integration.test.ts` |

---

## Code Placement

| What             | Where                            |
| ---------------- | -------------------------------- |
| Business logic   | `domains/[domain]/src/slices/`   |
| Entity/DTO types | `domains/[domain]/src/types/`    |
| Domain adapters  | `domains/[domain]/src/adapters/` |
| Domain tests     | `domains/[domain]/__tests__/`    |
| Supabase client  | `providers/supabase/`            |
| R2/KV utilities  | `providers/cloudflare/{r2,kv}/`  |
| UI patterns      | `ui/src/patterns/`               |
| Shared utils     | `shared/src/utils/`              |
| Migrations       | `supabase/migrations/`           |
| Workers          | `cloudflare/workers/[name]/`     |

---

## Import Aliases

```typescript
@workspace/domain-*      → packages/domains/*/src
@workspace/providers-*   → packages/providers/*/src
@workspace/ui            → packages/ui/src
@workspace/shared        → packages/shared/src
```

---

## Critical Constraints (NON-NEGOTIABLE)

| Rule                        | Reason                            |
| --------------------------- | --------------------------------- |
| No cross-domain imports     | Bounded contexts                  |
| Adapters are domain-local   | Owned infrastructure              |
| Providers = clients only    | No business logic                 |
| Pages compose slices        | UI composition layer              |
| Integration tests only      | Test behavior, not implementation |
| Barrel exports via index.ts | Controlled API surface            |

---

## Commands

```bash
# Dev
turbo run dev --filter=@workspace/backoffice

# Build
turbo run build --filter=@workspace/domain-order

# Test
turbo run test --filter=@workspace/domain-order

# Add deps
pnpm add zod --filter=@workspace/domain-order
pnpm add @workspace/shared --filter=@workspace/domain-order --workspace
```
