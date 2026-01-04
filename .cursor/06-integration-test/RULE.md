---
description: 'Integration test patterns for domain slices.'
alwaysApply: false
globs: ['packages/domains/**/__tests__/**/*']
---

# Integration Test Pattern

**Trigger:** Writing tests, fixtures, mocks for domain slices

## Structure

```
__tests__/
├── setup.ts                    # Test client, cleanup, helpers
├── fixtures/[domain].fixture.ts # Data factories
├── mocks/[domain].handlers.ts   # MSW handlers
└── integration/
    ├── [action].integration.test.ts      # Per-slice
    └── [domain]-workflow.integration.test.ts  # Multi-slice
```

---

## Setup

```typescript
// setup.ts
export let testClient: SupabaseClient;
export let testUserId: string;

beforeAll(async () => {
  testClient = createClient(URL, SERVICE_ROLE_KEY);
  // Create test user
});

beforeEach(async () => {
  await cleanupTables(['[domain]_items', '[domains]']);
});

// Helpers
export async function createTestRecord<T>(table: string, data: object): Promise<T>;
export async function getTestRecord<T>(table: string, id: string): Promise<T | null>;
```

---

## Fixtures

```typescript
// fixtures/[domain].fixture.ts
class [Entity]Fixture {
  // Command builders (for slice inputs)
  buildCreateCommand(overrides?: Partial<Command>): Command { ... }
  buildCreateCommandWithItems(count: number): Command { ... }

  // Entity builders (for assertions)
  buildEntity(overrides?: Partial<Entity>): Entity { ... }

  // Invalid data builders (for error tests)
  buildInvalidCommand_BelowMinimum(): Command { ... }
  buildInvalidCommand_DuplicateItems(): Command { ... }
  buildInvalidCommand_ExceedsMaxItems(max: number): Command { ... }

  // Query/Action builders
  buildListQuery(overrides?): Query { ... }
  buildCancelCommand(id: string, reason?: string): Command { ... }
}

export const [entity]Fixture = new [Entity]Fixture();
```

---

## MSW Handlers

```typescript
// mocks/[domain].handlers.ts
export const [entity]Handlers = [
  http.post(`${URL}/rest/v1/${TABLE}`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: uuid(), ...body, status: 'PENDING' });
  }),
  http.get(...),   // GET BY ID, LIST
  http.patch(...), // UPDATE
  http.delete(...) // DELETE
];

export const [entity]ErrorHandlers = {
  databaseError: http.post(..., () => HttpResponse.json({ message: 'DB error' }, { status: 500 })),
  conflictError: http.post(..., () => HttpResponse.json({ ... }, { status: 409 })),
  notFound: http.get(..., () => HttpResponse.json([])),
};
```

---

## Test Structure

```typescript
// integration/[action].integration.test.ts
describe('[Action] Integration', () => {
  const adapter = new [Entity]SupabaseAdapter(testClient);
  const deps = { repository: adapter };

  describe('Happy Path', () => {
    it('[action] with valid data', async () => {
      const command = fixture.buildCreateCommand({ customerId: testUserId });
      const result = await handleAction(command, deps);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({ status: 'PENDING' });

      // Verify DB
      const { data } = await testClient.from('table').select().eq('id', result.data.id).single();
      expect(data).not.toBeNull();
    });
  });

  describe('Business Rules', () => {
    it('rejects [violation]', async () => {
      const command = fixture.buildInvalidCommand_BelowMinimum();
      const result = await handleAction(command, deps);

      expect(result.success).toBe(false);
      expect(result.error.type).toBe('BUSINESS_RULE_ERROR');
    });
  });

  describe('Edge Cases', () => {
    it('handles [boundary]', async () => { ... });
  });

  describe('Error Scenarios', () => {
    it('handles [failure]', async () => { ... });
  });
});
```

---

## Workflow Test

```typescript
// integration/[domain]-workflow.integration.test.ts
describe('[Entity] Workflow', () => {
  it('complete lifecycle: create → confirm → process → complete', async () => {
    const createResult = await handleCreate(command, deps);
    expect(createResult.data.status).toBe('PENDING');

    const confirmResult = await handleUpdateStatus({ id, status: 'CONFIRMED' }, deps);
    expect(confirmResult.data.status).toBe('CONFIRMED');

    // ... continue through states
  });

  it('prevents invalid transitions', async () => {
    // Create → Complete (skip steps) → should fail
  });

  it('handles concurrent operations', async () => {
    const results = await Promise.all(commands.map((c) => handleCreate(c, deps)));
    expect(results.every((r) => r.success)).toBe(true);
  });
});
```

---

## Assertion Patterns

| Type          | Pattern                                                                            |
| ------------- | ---------------------------------------------------------------------------------- |
| Success       | `expect(result.success).toBe(true)`                                                |
| Data shape    | `expect(result.data).toMatchObject({ status: 'PENDING' })`                         |
| Error type    | `expect(result.error.type).toBe('VALIDATION_ERROR')`                               |
| Error message | `expect(result.error.messages).toContainEqual(expect.stringContaining('Minimum'))` |
| DB verify     | `const { data } = await testClient.from('x').select().eq('id', id).single()`       |
| Array length  | `expect(result.data.items).toHaveLength(3)`                                        |
| Numeric       | `expect(result.data.total).toBeCloseTo(118.50, 2)`                                 |

---

## Test Naming

| Category      | Pattern                          |
| ------------- | -------------------------------- |
| Happy path    | `[action] with valid [scenario]` |
| Business rule | `rejects [entity] [violation]`   |
| Edge case     | `handles [boundary condition]`   |
| Error         | `handles [failure type]`         |
| Workflow      | `[flow description]`             |

---

## Coverage Checklist

- [ ] Happy path (valid data → success)
- [ ] All business rules (each rule → specific error)
- [ ] Edge cases (exact boundaries, limits)
- [ ] Error scenarios (DB errors, validation)
- [ ] Workflow transitions (valid + invalid)
- [ ] DB state verification
