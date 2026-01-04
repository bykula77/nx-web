---
description: 'Architecture patterns and cross-domain rules. IMMUTABLE constraints.'
alwaysApply: true
---

# Architecture Rules

## Layer Hierarchy (ENFORCED)

```
apps → domains → providers/ui → shared
```

| Layer     | Allowed Imports                | Forbidden            |
| --------- | ------------------------------ | -------------------- |
| apps      | domains, providers, ui, shared | Business logic       |
| domains   | providers, ui, shared          | Cross-domain imports |
| providers | shared                         | Business logic       |
| ui        | shared                         | Data fetching        |
| shared    | ∅                              | Any imports          |

---

## Cross-Domain Communication

> ⛔ **#1 RULE:** Domains NEVER import from other domains.

### Patterns

| Pattern               | When                  | How                                     |
| --------------------- | --------------------- | --------------------------------------- |
| **ID Reference**      | Need related data     | Store foreign ID, join in adapter query |
| **App Orchestration** | Multi-domain workflow | Page coordinates multiple hooks         |
| **Event-Driven**      | Async side effects    | DB trigger → Edge Function              |

### ID Reference + Query Join

```typescript
// Entity: store ID only
interface Order { customerId: string; }  // ✅
// interface Order { customer: Customer }  // ❌ NEVER

// Adapter: join at query
.from('orders').select('*, customer:customers!customer_id(id, name)')
```

### App Orchestration

```typescript
// Page coordinates domains - ONLY place for multi-domain logic
const order = await createOrder.mutateAsync(data);
await createInvoice.mutateAsync({ orderId: order.id });
await sendNotification.mutateAsync({ type: 'ORDER_CREATED', entityId: order.id });
```

### Event-Driven

```
Order Insert → DB Trigger → Edge Function → Email/Analytics/Sync
```

---

## Ports/Adapters Pattern

```typescript
// Port (contract)
interface OrderRepositoryPort {
  create(data: CreateOrderDTO): Promise<Result<Order>>;
  findById(id: string): Promise<Order | null>;
}

// Handler depends on Port (not concrete)
async function handleCreateOrder(cmd, deps: { repository: OrderRepositoryPort }) {
  return deps.repository.create(cmd);
}

// Adapter implements Port
class OrderSupabaseAdapter implements OrderRepositoryPort { ... }
```

---

## Slice Independence

```
✅ slice-a/ → domain/shared/, domain/types/
✅ slice-b/ → domain/shared/, domain/types/
❌ slice-a/ → slice-b/  (NEVER)
```

Share logic via `domain/shared/`, not between slices.

---

## Result Pattern (ENFORCED)

```typescript
type Result<T, E = string> = { success: true; data: T } | { success: false; error: E };

// ✅ Handlers return Result
if (invalid) return err('Validation failed');
return ok(order);

// ❌ NEVER throw in handlers
throw new Error('Validation failed');
```

---

## Provider vs Domain Adapter

| Location                         | Responsibility                   |
| -------------------------------- | -------------------------------- |
| `providers/stripe/`              | Raw SDK wrapper, auth, API calls |
| `domains/subscription/adapters/` | Business mapping, domain logic   |

```typescript
// Provider: generic, no business logic
class StripeClient {
  createCustomer(email);
}

// Domain Adapter: maps domain ↔ provider
class SubscriptionStripeAdapter implements PaymentPort {
  createSubscription(dto) {
    // DTO → Stripe params → Domain entity
  }
}
```

---

## Webhook Location

| Source                    | Location              |
| ------------------------- | --------------------- |
| External (Stripe, Twilio) | `cloudflare/workers/` |
| Internal (DB trigger)     | `supabase/functions/` |

---

## Anti-Patterns (BLOCKING)

```typescript
// ❌ Cross-domain import
import { UserRepository } from '@workspace/domain-user';

// ❌ Domain querying another domain's table
await this.client.from('users').select(); // in order adapter

// ❌ Shared service between domains
packages / domains / shared - services / order - user.service.ts;

// ❌ Event bus in domain
eventBus.emit('order:created', order);
```

---

## Quick Reference

| Scenario                     | Solution                   |
| ---------------------------- | -------------------------- |
| Order needs customer name    | Query join in adapter      |
| Order creates invoice        | App-level orchestration    |
| Status change sends email    | DB trigger → Edge Function |
| Dashboard multi-domain stats | Page calls multiple hooks  |
| Shared calculation           | `shared/src/utils/`        |
