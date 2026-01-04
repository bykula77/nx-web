# 🚀 Deployment Rehberi

Bu dokümanda projenin farklı ortamlara deploy edilmesi açıklanmaktadır.

---

## Environment'lar

| Environment    | Açıklama          | URL Pattern             |
| -------------- | ----------------- | ----------------------- |
| **Local**      | Geliştirme ortamı | `localhost:*`           |
| **Preview**    | PR preview'ları   | `[branch].*.pages.dev`  |
| **Staging**    | Test ortamı       | `staging.*.pages.dev`   |
| **Production** | Canlı ortam       | `*.com` (custom domain) |

---

## Local Development Setup

### Gereksinimler

- Node.js 20+
- pnpm 10+
- Docker (Supabase için)
- Supabase CLI

### Kurulum

```bash
# 1. Repository'yi klonla
git clone https://github.com/[org]/nx-web.git
cd nx-web

# 2. Dependencies'leri yükle
pnpm install

# 3. Environment dosyasını oluştur
cp .env.example .env.local

# 4. Supabase'i başlat
supabase start

# 5. Environment'ı senkronize et
pnpm sync-env

# 6. Environment'ı doğrula
pnpm validate-env

# 7. Development server'ı başlat
pnpm dev
```

### Local Supabase

```bash
# Başlat
supabase start

# Durdur
supabase stop

# Status
supabase status

# Database reset
supabase db reset

# Migration oluştur
supabase migration new [migration-name]

# TypeScript types generate et
pnpm generate-types
```

---

## Cloudflare Pages Setup

### 1. Cloudflare Hesabı Oluştur

1. [Cloudflare Dashboard](https://dash.cloudflare.com)'a git
2. Hesap oluştur veya giriş yap
3. Account ID'ni not al (Account Home > sağ sidebar)

### 2. API Token Oluştur

1. [API Tokens](https://dash.cloudflare.com/profile/api-tokens) sayfasına git
2. "Create Token" > "Custom token"
3. Permissions:
   - `Account` > `Cloudflare Pages` > `Edit`
   - `Zone` > `Zone` > `Read` (opsiyonel, custom domain için)
4. Token'ı güvenli bir yere kaydet

### 3. Pages Projeleri Oluştur

Her uygulama için bir Pages projesi oluştur:

```bash
# Web (Marketing)
wrangler pages project create nx-web

# Backoffice (Admin)
wrangler pages project create nx-backoffice

# Client Panel
wrangler pages project create nx-client-panel
```

### 4. GitHub Repository Bağla (Opsiyonel)

Cloudflare Dashboard'dan:

1. Pages > Project > Settings > Builds & deployments
2. "Connect to Git" > GitHub repository seç
3. Build settings:
   - Build command: `pnpm --filter @nx-web/[app] build`
   - Build output directory: `apps/[app]/dist`

---

## GitHub Secrets Ayarlama

Repository Settings > Secrets and variables > Actions > New repository secret

### Zorunlu Secrets

| Secret                          | Açıklama                | Örnek                     |
| ------------------------------- | ----------------------- | ------------------------- |
| `CLOUDFLARE_API_TOKEN`          | Cloudflare API token    | `abc123...`               |
| `CLOUDFLARE_ACCOUNT_ID`         | Cloudflare account ID   | `1234567890abcdef`        |
| `NEXT_PUBLIC_SUPABASE_URL`      | Production Supabase URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key       | `eyJ...`                  |

### Opsiyonel Secrets

| Secret                      | Açıklama               | Ne zaman gerekli   |
| --------------------------- | ---------------------- | ------------------ |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side operations | Edge Functions     |
| `SANITY_PROJECT_ID`         | Sanity CMS             | Web app (blog)     |
| `SANITY_DATASET`            | Sanity dataset         | Web app (blog)     |
| `SENTRY_DSN`                | Error tracking         | Monitoring aktifse |

---

## Supabase Production Setup

### 1. Proje Oluştur

1. [Supabase Dashboard](https://supabase.com/dashboard)'a git
2. "New Project" > Organization seç
3. Proje detayları:
   - Name: `nx-web-production`
   - Database Password: güçlü bir şifre
   - Region: Kullanıcılarınıza yakın (örn: Frankfurt)

### 2. API Keys'i Al

Project Settings > API:

- **URL**: `https://[project-ref].supabase.co`
- **anon/public**: Client-side için
- **service_role**: Server-side için (gizli tut!)

### 3. Database Migration

```bash
# Local'den production'a migration push
supabase db push --linked

# Veya migration dosyalarını kullan
supabase migration up --linked
```

### 4. Authentication Ayarları

Project Settings > Authentication:

1. **Site URL**: `https://your-domain.com`
2. **Redirect URLs**:
   - `https://your-domain.com/**`
   - `https://*.pages.dev/**` (preview için)
3. **Email Templates**: Özelleştir
4. **Providers**: Google, GitHub vb. aktifleştir

### 5. Row Level Security (RLS)

```sql
-- Örnek: Users tablosu için RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi kaydını görebilir
CREATE POLICY "Users can view own record"
ON users FOR SELECT
USING (auth.uid() = id);

-- Kullanıcı kendi kaydını güncelleyebilir
CREATE POLICY "Users can update own record"
ON users FOR UPDATE
USING (auth.uid() = id);
```

---

## DNS Configuration

### Cloudflare DNS ile Custom Domain

1. Cloudflare Dashboard > Domain > DNS
2. CNAME kayıtları ekle:

| Type  | Name    | Content                     | Proxy |
| ----- | ------- | --------------------------- | ----- |
| CNAME | `@`     | `nx-web.pages.dev`          | ✅    |
| CNAME | `admin` | `nx-backoffice.pages.dev`   | ✅    |
| CNAME | `app`   | `nx-client-panel.pages.dev` | ✅    |

### Pages'da Custom Domain Bağla

1. Pages > Project > Custom domains
2. "Set up a custom domain"
3. Domain'i gir (örn: `example.com`)
4. DNS kaydı otomatik oluşturulur

### SSL/TLS Ayarları

Cloudflare Dashboard > SSL/TLS:

- Encryption mode: **Full (strict)**
- Always Use HTTPS: ✅
- Automatic HTTPS Rewrites: ✅

---

## Environment Variables

### Cloudflare Pages'da Env Vars

Pages > Project > Settings > Environment variables

| Variable                        | Production | Preview     |
| ------------------------------- | ---------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | prod URL   | staging URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | prod key   | staging key |
| `NODE_VERSION`                  | `20`       | `20`        |

### Build-time vs Runtime

```typescript
// Build-time (Vite/Astro ile inject edilir)
const url = import.meta.env.PUBLIC_SUPABASE_URL;

// Runtime (sadece server-side)
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

---

## Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        DEVELOPER                                 │
│                                                                  │
│  1. git push feature/xxx ─────────────────────────────────────┐ │
│                                                                │ │
└────────────────────────────────────────────────────────────────┼─┘
                                                                 │
                                                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GITHUB ACTIONS                             │
│                                                                  │
│  2. CI Workflow                                                 │
│     ├── Lint                                                    │
│     ├── Type Check                                              │
│     ├── Test                                                    │
│     └── Build                                                   │
│                                                                  │
│  3. PR Merge to main ──────────────────────────────────────────┐│
│                                                                ││
└────────────────────────────────────────────────────────────────┼┘
                                                                 │
                                                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE PAGES                             │
│                                                                  │
│  4. Deploy Workflow                                             │
│     ├── Build app                                               │
│     └── Deploy to Cloudflare                                    │
│                                                                  │
│  5. Live at https://your-domain.com                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Rollback

### Cloudflare Pages Rollback

1. Pages > Project > Deployments
2. Eski deployment'ı bul
3. "..." menüsü > "Rollback to this deployment"

### Database Rollback

```bash
# Migration'ları geri al
supabase migration repair --status reverted [version]

# Veya backup'tan restore
# Supabase Dashboard > Database > Backups
```

---

## Monitoring & Debugging

### Cloudflare Analytics

- Pages > Project > Analytics
- Real User Monitoring (RUM)
- Core Web Vitals

### Supabase Logs

- Dashboard > Logs > API logs
- Dashboard > Logs > Postgres logs
- Dashboard > Logs > Auth logs

### Error Tracking (Opsiyonel)

Sentry veya benzeri bir servis ekleyebilirsiniz:

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

---

## Checklist: Production Deploy

- [ ] **Environment Variables**
  - [ ] Tüm secrets GitHub'da tanımlı
  - [ ] Cloudflare Pages env vars ayarlı
  - [ ] Supabase production keys doğru

- [ ] **Database**
  - [ ] Migration'lar production'da çalıştırıldı
  - [ ] RLS policies aktif
  - [ ] Backup schedule ayarlı

- [ ] **DNS & SSL**
  - [ ] Custom domain bağlı
  - [ ] SSL sertifikası aktif
  - [ ] HTTPS redirect aktif

- [ ] **Authentication**
  - [ ] Site URL doğru
  - [ ] Redirect URLs ekli
  - [ ] Email templates özelleştirildi

- [ ] **Monitoring**
  - [ ] Error tracking aktif
  - [ ] Analytics aktif
  - [ ] Uptime monitoring (opsiyonel)
