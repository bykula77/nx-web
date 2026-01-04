# NX-Web Monorepo

Turborepo tabanlı full-stack web uygulaması.

## Tech Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Backoffice:** Refine.js + Ant Design
- **Client Panel:** Refine.js + Ant Design
- **Web:** Astro + Sanity + Tailwind
- **Database:** Supabase (PostgreSQL + Auth + Realtime)
- **Storage:** Cloudflare R2
- **Testing:** Vitest + MSW + Testing Library

## Başlangıç

```bash
# Bağımlılıkları yükle
pnpm install

# Development sunucularını başlat
pnpm dev

# Build
pnpm build

# Test
pnpm test

# Lint
pnpm lint
```

## Proje Yapısı

```
nx-web/
├── apps/
│   ├── backoffice/      # Admin panel
│   ├── client-panel/    # Müşteri paneli
│   └── web/             # Public website
├── packages/
│   ├── domains/         # Domain modülleri
│   ├── providers/       # Supabase, Auth, Cloudflare
│   ├── ui/              # Paylaşılan UI bileşenleri
│   ├── shared/          # Utility fonksiyonlar
│   └── testing/         # Test altyapısı
├── tooling/             # Generators ve scripts
├── supabase/            # Migrations ve functions
└── cloudflare/          # Workers
```

## Ortamlar

- `dev` - Lokal geliştirme
- `staging` - Test ortamı
- `prod` - Production

## Lisans

Private
