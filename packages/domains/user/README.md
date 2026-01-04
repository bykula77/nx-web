# @nx-web/domain-user

User domain module implementing vertical slice architecture pattern.

## Structure

```
src/
├── types/           # Entity, DTOs, schemas, constants
├── ports/           # Repository & service interfaces
├── adapters/        # Supabase & cache implementations
├── shared/          # Domain-wide utilities
└── slices/          # Vertical slices
    ├── create-user/
    ├── update-user/
    ├── list-users/
    └── delete-user/
```

## Usage

### Types

```typescript
import { User, UserRole, UserStatus, createUserSchema } from '@nx-web/domain-user';

// Validate input
const result = createUserSchema.safeParse(input);
```

### Adapters

```typescript
import { UserSupabaseAdapter } from '@nx-web/domain-user';
import { supabaseClient } from '@nx-web/supabase';

const userRepository = new UserSupabaseAdapter(supabaseClient);
```

### Slices

Each slice contains:
- `command.ts` / `query.ts` - Input types
- `handler.ts` - Business logic
- `rules.ts` - Business rules
- `useXxx.ts` - React hook
- `XxxForm.tsx` / `XxxTable.tsx` - UI components

```typescript
// Create user
import { useCreateUser, CreateUserForm } from '@nx-web/domain-user';

function MyComponent() {
  const createUserMutation = useCreateUser(createUserFn, {
    onSuccess: (user) => console.log('Created:', user),
  });

  return <CreateUserForm onSubmit={createUserMutation.mutateAsync} />;
}

// List users
import { useListUsers, UserListTable } from '@nx-web/domain-user';

function UserListPage() {
  const { data, isLoading } = useListUsers(listUsersFn, { filters: { role: 'admin' } });

  return (
    <UserListTable
      data={data?.items ?? []}
      total={data?.total ?? 0}
      page={data?.page ?? 1}
      pageSize={data?.pageSize ?? 10}
      isLoading={isLoading}
    />
  );
}
```

### Shared Utilities

```typescript
import {
  getUserDisplayName,
  formatUserRole,
  isUserActive,
  toUserDTO,
} from '@nx-web/domain-user';

const displayName = getUserDisplayName(user);
const roleLabel = formatUserRole(user.role);
const isActive = isUserActive(user);
const dto = toUserDTO(user);
```

## Testing

```bash
pnpm test        # Run tests
pnpm test:watch  # Watch mode
```

## Creating New Slices

1. Create folder under `src/slices/`
2. Add command/query type
3. Add business rules
4. Add handler
5. Add React hook
6. Add UI component (if needed)
7. Export from slice index
8. Add to main index

