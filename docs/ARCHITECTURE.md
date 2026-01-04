# 🏗️ Proje Mimarisi

## Genel Bakış

NX-Web, **Turborepo** tabanlı bir monorepo projesidir. Birden fazla uygulama ve paylaşılan paketleri tek bir repository'de yönetir.

## Tech Stack

| Katman              | Teknoloji                                          |
| ------------------- | -------------------------------------------------- |
| **Monorepo**        | Turborepo + pnpm workspaces                        |
| **Web (Marketing)** | Astro + Tailwind CSS                               |
| **Admin Panelleri** | React + Vite + Refine + Ant Design                 |
| **Backend**         | Supabase (Auth, Database, Storage, Edge Functions) |
| **Hosting**         | Cloudflare Pages                                   |
| **Storage**         | Cloudflare R2                                      |
| **CMS**             | Sanity                                             |
| **Testing**         | Vitest                                             |
| **Linting**         | ESLint + Prettier                                  |

---

## Proje Yapısı

```
nx-web/
├── apps/                      # Uygulamalar
│   ├── web/                   # Marketing website (Astro)
│   ├── backoffice/            # Admin paneli (React + Refine)
│   └── client-panel/          # Müşteri paneli (React + Refine)
│
├── packages/                  # Paylaşılan paketler
│   ├── shared/                # Utility'ler, hook'lar, tipler
│   ├── ui/                    # UI component kütüphanesi
│   ├── domains/               # İş mantığı (domain-driven)
│   │   └── user/              # User domain örneği
│   ├── providers/             # Dış servis entegrasyonları
│   │   ├── auth/              # Authentication provider
│   │   ├── supabase/          # Supabase client ve helpers
│   │   └── cloudflare/        # Cloudflare R2, KV, Workers
│   ├── config/                # Paylaşılan konfigürasyonlar
│   │   ├── eslint/            # ESLint config'leri
│   │   ├── typescript/        # TypeScript config'leri
│   │   └── vitest/            # Vitest config'leri
│   └── testing/               # Test utilities ve mocks
│
├── tooling/                   # Geliştirici araçları
│   ├── generators/            # Code generators
│   │   ├── domain/            # Yeni domain oluşturma
│   │   ├── page/              # Yeni sayfa oluşturma
│   │   └── slice/             # Yeni slice oluşturma
│   └── scripts/               # Utility script'leri
│
├── supabase/                  # Supabase konfigürasyonu
│   ├── config.toml            # Local Supabase ayarları
│   ├── migrations/            # Database migration'ları
│   └── functions/             # Edge functions
│
├── cloudflare/                # Cloudflare konfigürasyonu
│   └── workers/               # Cloudflare Workers
│
└── docs/                      # Dokümantasyon
```

---

## Package Dependency Graph

```
                    ┌─────────────────────────────────────────┐
                    │              APPLICATIONS               │
                    └─────────────────────────────────────────┘
                               │         │         │
                    ┌──────────┘         │         └──────────┐
                    ▼                    ▼                    ▼
              ┌──────────┐        ┌──────────────┐      ┌──────────────┐
              │   web    │        │  backoffice  │      │ client-panel │
              │  (Astro) │        │   (React)    │      │   (React)    │
              └────┬─────┘        └──────┬───────┘      └──────┬───────┘
                   │                     │                     │
                   └──────────┬──────────┴──────────┬──────────┘
                              │                     │
                    ┌─────────▼─────────┐ ┌────────▼────────┐
                    │     @nx-web/ui    │ │ @nx-web/domains │
                    │  (UI Components)  │ │ (Business Logic)│
                    └─────────┬─────────┘ └────────┬────────┘
                              │                    │
                              └────────┬───────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │          @nx-web/providers          │
                    │   (auth, supabase, cloudflare)      │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │           @nx-web/shared            │
                    │  (utils, hooks, types, constants)   │
                    └─────────────────────────────────────┘
```

### Bağımlılık Kuralları

1. **apps/** → tüm packages'ları kullanabilir
2. **packages/domains/** → providers, shared kullanabilir
3. **packages/providers/** → sadece shared kullanabilir
4. **packages/shared/** → hiçbir internal paketi kullanamaz
5. **packages/ui/** → sadece shared kullanabilir

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                          │
│                                                                     │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐   │
│  │   React     │────▶│   Domain    │────▶│     Provider        │   │
│  │  Component  │◀────│   Slice     │◀────│  (Supabase Client)  │   │
│  └─────────────┘     └─────────────┘     └──────────┬──────────┘   │
│                                                      │              │
└──────────────────────────────────────────────────────┼──────────────┘
                                                       │
                                                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SUPABASE (Backend)                          │
│                                                                     │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐   │
│  │   Auth      │     │  Database   │     │      Storage        │   │
│  │  (GoTrue)   │     │ (PostgreSQL)│     │       (S3)          │   │
│  └─────────────┘     └─────────────┘     └─────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     Edge Functions                           │   │
│  │              (Deno-based serverless functions)               │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Veri Akışı Adımları

1. **UI Event** → Kullanıcı bir aksiyon tetikler
2. **Domain Slice** → İş mantığı ve state yönetimi
3. **Provider** → Supabase client ile API çağrısı
4. **Supabase** → Database/Auth/Storage işlemi
5. **Response** → Veri UI'a geri döner

---

## Klasör Açıklamaları

### `/apps`

Her uygulama bağımsız deploy edilebilir:

| Uygulama       | Açıklama                          | Port |
| -------------- | --------------------------------- | ---- |
| `web`          | Astro ile marketing sitesi        | 4321 |
| `backoffice`   | Admin paneli (iç kullanıcılar)    | 5173 |
| `client-panel` | Müşteri paneli (son kullanıcılar) | 5174 |

### `/packages/domains`

Her domain vertical slice pattern izler:

```
user/
├── src/
│   ├── types/          # Domain types & interfaces
│   ├── ports/          # Abstract interfaces (contracts)
│   ├── adapters/       # Concrete implementations
│   ├── slices/         # Feature slices (UI + logic)
│   └── shared/         # Domain-specific utilities
└── __tests__/          # Integration & unit tests
```

### `/packages/providers`

Dış servislerin wrapper'ları:

- **auth**: Authentication state ve hooks
- **supabase**: Database client ve helpers
- **cloudflare**: R2 storage, KV store, Workers

### `/packages/config`

Paylaşılan konfigürasyonlar:

- **eslint**: Base ve React ESLint config'leri
- **typescript**: Base, Node ve React tsconfig'leri
- **vitest**: Test konfigürasyonları

---

## Environment Yönetimi

```
.env.local          # Local development (gitignore'da)
.env.example        # Template (commit edilir)
.env.production     # Production (Cloudflare'da)
```

Environment değişkenleri `@nx-web/shared` paketindeki `env` modülü ile validate edilir.

---

## Build Pipeline

```
pnpm build
    │
    ▼
┌─────────────────────────────────────────┐
│           Turborepo Orchestration       │
│                                         │
│  1. Build @nx-web/shared               │
│  2. Build @nx-web/providers/* (parallel)│
│  3. Build @nx-web/domains/* (parallel)  │
│  4. Build @nx-web/ui                    │
│  5. Build apps/* (parallel)             │
│                                         │
│  Cache: .turbo/ (incremental builds)    │
└─────────────────────────────────────────┘
```
