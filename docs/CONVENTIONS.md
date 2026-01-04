# 📏 Kod Konvansiyonları

Bu dokümanda projedeki isimlendirme kuralları, kod stili ve Git stratejisi açıklanmaktadır.

---

## Naming Conventions

### Dosya ve Klasör İsimlendirme

| Tip | Format | Örnek |
|-----|--------|-------|
| React Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase, use prefix | `useAuth.ts` |
| Utilities | kebab-case | `string-utils.ts` |
| Types | kebab-case | `user.types.ts` |
| Constants | kebab-case | `api.constants.ts` |
| Test files | same-name.test | `UserProfile.test.tsx` |
| Config files | kebab-case | `vite.config.ts` |

### Klasör İsimlendirme

| Klasör Tipi | Format | Örnek |
|-------------|--------|-------|
| Feature/Domain | kebab-case | `user-profile/` |
| Component grupları | kebab-case | `form-elements/` |
| Genel kategoriler | kebab-case | `hooks/`, `utils/` |

### Kod İsimlendirme

```typescript
// ✅ Components - PascalCase
export function UserAvatar() { }
export const ProfileCard: React.FC = () => { }

// ✅ Hooks - camelCase, use prefix
export function useUserProfile() { }
export function useLocalStorage() { }

// ✅ Functions - camelCase
export function formatDate() { }
export function calculateTotal() { }

// ✅ Constants - SCREAMING_SNAKE_CASE
export const API_BASE_URL = '';
export const MAX_FILE_SIZE = 1024;

// ✅ Types/Interfaces - PascalCase
type UserRole = 'admin' | 'user';
interface UserProfile { }

// ✅ Enums - PascalCase (members da PascalCase)
enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

// ✅ Zod Schemas - camelCase + Schema suffix
const userSchema = z.object({ });
const createUserSchema = z.object({ });
```

---

## Code Style Guidelines

### TypeScript

```typescript
// ✅ Explicit return types for exported functions
export function getUser(id: string): Promise<User> { }

// ✅ Use type imports
import type { User } from './types';

// ✅ Prefer interfaces for objects, types for unions/intersections
interface UserProfile {
  id: string;
  name: string;
}

type UserRole = 'admin' | 'user' | 'guest';

// ✅ Use const assertions for literal types
const ROLES = ['admin', 'user', 'guest'] as const;

// ❌ Avoid any
function process(data: any) { } // Bad
function process(data: unknown) { } // Better
```

### React

```tsx
// ✅ Function components with explicit props type
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant, children, onClick }: ButtonProps) {
  return (
    <button className={variant} onClick={onClick}>
      {children}
    </button>
  );
}

// ✅ Custom hooks return object for named destructuring
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  return { user, loading, setUser };
}

// ✅ Memoization when needed
const MemoizedComponent = memo(ExpensiveComponent);
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a), [a]);
```

### Import Sıralaması

```typescript
// 1. React/Framework imports
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

// 3. Internal packages (@nx-web/*)
import { Button } from '@nx-web/ui';
import { useAuth } from '@nx-web/auth';

// 4. Relative imports (parent first)
import { UserContext } from '../contexts';
import { formatDate } from './utils';

// 5. Type imports (same order)
import type { User } from '@nx-web/shared';
import type { ButtonProps } from './types';

// 6. Styles (if any)
import './styles.css';
```

---

## Git Branch Strategy

### Ana Branch'ler

| Branch | Açıklama |
|--------|----------|
| `main` | Production-ready kod. Her commit deploy edilir. |
| `develop` | Aktif geliştirme branch'i. Feature'lar buraya merge edilir. |

### Geçici Branch'ler

| Pattern | Açıklama | Örnek |
|---------|----------|-------|
| `feature/*` | Yeni özellikler | `feature/user-profile` |
| `bugfix/*` | Bug düzeltmeleri | `bugfix/login-redirect` |
| `hotfix/*` | Acil production fix'leri | `hotfix/critical-auth-bug` |
| `chore/*` | Bakım işleri | `chore/update-dependencies` |
| `docs/*` | Dokümantasyon | `docs/api-documentation` |
| `refactor/*` | Kod refactoring | `refactor/auth-module` |

### Branch Akışı

```
main ◄────────────────────────────────────────────────┐
  │                                                   │
  └──▶ develop ◄──────────────────────────────────────┤
         │                                            │
         ├──▶ feature/user-profile ──────────────────▶┤
         │                                            │
         ├──▶ feature/dashboard ─────────────────────▶┤
         │                                            │
         └──▶ bugfix/login-error ────────────────────▶┘
```

---

## Commit Message Format

[Conventional Commits](https://www.conventionalcommits.org/) standardını kullanıyoruz.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Açıklama |
|------|----------|
| `feat` | Yeni özellik |
| `fix` | Bug düzeltmesi |
| `docs` | Dokümantasyon değişikliği |
| `style` | Kod formatı (boşluk, noktalama vb.) |
| `refactor` | Ne feat ne fix olan kod değişikliği |
| `perf` | Performans iyileştirmesi |
| `test` | Test ekleme/düzeltme |
| `build` | Build sistemi değişikliği |
| `ci` | CI konfigürasyonu değişikliği |
| `chore` | Diğer değişiklikler |
| `revert` | Önceki commit'i geri alma |

### Scopes

| Scope | Açıklama |
|-------|----------|
| `web` | Web uygulaması |
| `backoffice` | Backoffice uygulaması |
| `client` | Client panel uygulaması |
| `ui` | UI paketleri |
| `shared` | Shared paketler |
| `auth` | Authentication |
| `domain/user` | User domain'i |
| `supabase` | Supabase provider |
| `ci` | CI/CD |
| `deps` | Dependencies |

### Örnekler

```bash
# Yeni özellik
feat(auth): add social login with Google

# Bug düzeltme
fix(backoffice): resolve user list pagination issue

# Breaking change (! ile işaretlenir)
feat(api)!: change authentication endpoint structure

BREAKING CHANGE: /api/auth/login now requires email instead of username

# Çoklu satır
feat(domain/user): implement user profile management

- Add profile update functionality
- Add avatar upload support
- Add email verification flow

Closes #123
```

---

## Pull Request Template

PR oluştururken aşağıdaki template'i kullanın:

```markdown
## 📝 Açıklama

Bu PR'ın ne yaptığının kısa açıklaması.

## 🔗 İlgili Issue

Closes #[issue_number]

## 📋 Değişiklik Tipi

- [ ] 🐛 Bug fix (breaking change olmayan düzeltme)
- [ ] ✨ New feature (breaking change olmayan yeni özellik)
- [ ] 💥 Breaking change (mevcut işlevselliği bozan değişiklik)
- [ ] 📚 Documentation (sadece dokümantasyon)
- [ ] 🧹 Chore (bakım, refactoring)

## 🧪 Test

- [ ] Unit testler eklendi/güncellendi
- [ ] Integration testler eklendi/güncellendi
- [ ] Manuel test yapıldı

## 📸 Screenshots (UI değişikliği varsa)

| Önce | Sonra |
|------|-------|
| img  | img   |

## ✅ Checklist

- [ ] Kod style guidelines'a uygun
- [ ] Self-review yapıldı
- [ ] Gerekli yorumlar eklendi
- [ ] Dokümantasyon güncellendi
- [ ] Breaking change varsa migration guide eklendi
```

---

## ESLint & Prettier

### ESLint Kuralları

```javascript
// Önemli kurallar
{
  // Import sıralaması
  "import/order": ["error", {
    "groups": ["builtin", "external", "internal", "parent", "sibling"],
    "newlines-between": "always"
  }],
  
  // Unused variables
  "@typescript-eslint/no-unused-vars": ["error", {
    "argsIgnorePattern": "^_"
  }],
  
  // Explicit return types
  "@typescript-eslint/explicit-function-return-type": "warn"
}
```

### Prettier Ayarları

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## Dosya Organizasyonu

### Component Dosyası

```
UserProfile/
├── UserProfile.tsx      # Ana component
├── UserProfile.test.tsx # Testler
├── UserProfile.styles.ts # Styled components (opsiyonel)
├── types.ts             # Component-specific types
├── hooks.ts             # Component-specific hooks
└── index.ts             # Barrel export
```

### index.ts (Barrel Export)

```typescript
// ✅ Named exports tercih edin
export { UserProfile } from './UserProfile';
export type { UserProfileProps } from './types';

// ❌ Default export'tan kaçının
export { default } from './UserProfile'; // Avoid
```

