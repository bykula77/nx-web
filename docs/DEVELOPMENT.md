# 💻 Geliştirici Rehberi

Bu dokümanda projeye başlangıç, sık kullanılan komutlar ve sorun giderme ipuçları yer almaktadır.

---

## Getting Started

### Gereksinimler

| Araç | Minimum Versiyon | Kurulum |
|------|------------------|---------|
| Node.js | 20.0.0+ | [nodejs.org](https://nodejs.org) veya `nvm` |
| pnpm | 10.0.0+ | `npm install -g pnpm` |
| Docker | 20.0.0+ | [docker.com](https://docker.com) |
| Supabase CLI | 1.0.0+ | `brew install supabase/tap/supabase` |
| Git | 2.0.0+ | [git-scm.com](https://git-scm.com) |

### Versiyon Kontrolü

```bash
node --version    # v20.x.x
pnpm --version    # 10.x.x
docker --version  # 20.x.x+
supabase --version
```

### İlk Kurulum

```bash
# 1. Repository'yi klonla
git clone https://github.com/[org]/nx-web.git
cd nx-web

# 2. Node versiyonunu ayarla (nvm kullanıyorsan)
nvm use

# 3. Dependencies'leri yükle
pnpm install

# 4. Environment dosyasını oluştur
pnpm sync-env

# 5. Supabase'i başlat (Docker gerekli)
supabase start

# 6. Database types generate et
pnpm generate-types

# 7. Environment'ı doğrula
pnpm validate-env

# 8. Development server'ı başlat
pnpm dev
```

### Uygulama URL'leri

| Uygulama | URL | Açıklama |
|----------|-----|----------|
| Web | http://localhost:4321 | Marketing sitesi |
| Backoffice | http://localhost:5173 | Admin paneli |
| Client Panel | http://localhost:5174 | Müşteri paneli |
| Supabase Studio | http://localhost:54323 | Database UI |
| Mailpit | http://localhost:54324 | Email testing |

---

## Sık Kullanılan Komutlar

### Development

```bash
# Tüm uygulamaları başlat
pnpm dev

# Tek bir uygulamayı başlat
pnpm --filter @nx-web/web dev
pnpm --filter @nx-web/backoffice dev
pnpm --filter @nx-web/client-panel dev

# Turbo ile specific target
pnpm turbo run dev --filter=@nx-web/web
```

### Build

```bash
# Tüm projeyi build et
pnpm build

# Tek bir uygulamayı build et
pnpm --filter @nx-web/web build

# Production build (cache temizle)
pnpm turbo run build --force
```

### Testing

```bash
# Tüm testleri çalıştır
pnpm test

# Watch mode
pnpm test:watch

# Coverage raporu
pnpm test:coverage

# UI ile test
pnpm test:ui

# Tek bir paketi test et
pnpm --filter @nx-web/shared test
```

### Linting & Formatting

```bash
# Lint kontrolü
pnpm lint

# Lint hataları düzelt
pnpm lint:fix

# Type check
pnpm type-check

# Format kontrolü
pnpm format:check

# Format uygula
pnpm format
```

### Database

```bash
# Supabase başlat
supabase start

# Supabase durdur
supabase stop

# Database durumu
supabase status

# Database reset (dikkatli!)
supabase db reset

# Yeni migration oluştur
supabase migration new [migration-name]

# TypeScript types generate et
pnpm generate-types
```

### Environment

```bash
# Environment'ı doğrula
pnpm validate-env

# .env.example'dan .env.local'e senkronize et
pnpm sync-env
```

### Temizlik

```bash
# Tüm build output'ları temizle
pnpm clean

# Node modules dahil temizle
pnpm clean && rm -rf node_modules

# Turbo cache temizle
rm -rf .turbo

# Full reset
pnpm clean && rm -rf node_modules .turbo && pnpm install
```

---

## Workspace Filtreleme

Turbo ve pnpm ile specific paketleri hedefleyebilirsiniz:

```bash
# Paket adına göre
pnpm --filter @nx-web/shared [command]
pnpm --filter @nx-web/ui [command]

# Glob pattern
pnpm --filter "@nx-web/domain-*" [command]
pnpm --filter "./packages/**" [command]

# Dependency graph'a göre
pnpm --filter @nx-web/backoffice... build  # Bağımlılıkları dahil
pnpm --filter ...@nx-web/shared build      # Bağımlıları dahil
```

---

## IDE Setup

### VS Code Extensions

Önerilen extension'lar:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "astro-build.astro-vscode",
    "ms-azuretools.vscode-docker"
  ]
}
```

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Debugging Tips

### React DevTools

1. [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/) Chrome extension'ı yükle
2. Uygulamayı aç
3. DevTools > Components tab

### Network Debugging

```typescript
// Supabase isteklerini logla
const supabase = createClient(url, key, {
  global: {
    fetch: (url, options) => {
      console.log('Supabase request:', url, options);
      return fetch(url, options);
    },
  },
});
```

### Console Logging

```typescript
// Development'ta conditional logging
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}

// Veya debug utility kullan
import debug from 'debug';
const log = debug('app:auth');
log('User logged in:', user.id);
```

### Breakpoints

VS Code'da breakpoint kullanmak için `launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Backoffice",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/apps/backoffice/src"
    }
  ]
}
```

---

## Troubleshooting

### Sorun: `pnpm install` başarısız

**Sebep**: Node veya pnpm versiyonu uyumsuz

**Çözüm**:
```bash
# Versiyonları kontrol et
node --version  # 20+ olmalı
pnpm --version  # 10+ olmalı

# nvm ile doğru versiyonu kullan
nvm use 20
```

---

### Sorun: Supabase başlamıyor

**Sebep**: Docker çalışmıyor veya port'lar kullanımda

**Çözüm**:
```bash
# Docker'ın çalıştığını kontrol et
docker ps

# Eski container'ları temizle
supabase stop
docker system prune -f

# Tekrar başlat
supabase start
```

---

### Sorun: TypeScript hataları

**Sebep**: Generate edilmiş tipler güncel değil

**Çözüm**:
```bash
# Types'ı yeniden generate et
pnpm generate-types

# TypeScript cache temizle
rm -rf node_modules/.cache

# VS Code'u reload et
# Cmd/Ctrl + Shift + P > "Reload Window"
```

---

### Sorun: Hot reload çalışmıyor

**Sebep**: Vite cache veya watcher sorunu

**Çözüm**:
```bash
# Vite cache temizle
rm -rf apps/*/node_modules/.vite

# Development server'ı yeniden başlat
# Ctrl+C ile durdur, sonra:
pnpm dev
```

---

### Sorun: Build başarısız

**Sebep**: Eksik environment variables

**Çözüm**:
```bash
# Environment'ı kontrol et
pnpm validate-env

# Eksik değişkenleri .env.local'e ekle
pnpm sync-env

# .env.local'i düzenle ve değerleri gir
```

---

### Sorun: Test'ler başarısız

**Sebep**: Test environment setup eksik

**Çözüm**:
```bash
# Test-specific dependencies kontrol et
pnpm --filter @nx-web/testing install

# Tek bir test dosyasını çalıştır
pnpm test -- path/to/test.test.ts

# Verbose output
pnpm test -- --reporter=verbose
```

---

### Sorun: Port zaten kullanımda

**Sebep**: Başka bir process port'u kullanıyor

**Çözüm**:
```bash
# Hangi process port'u kullanıyor?
lsof -i :5173

# Process'i öldür
kill -9 [PID]

# Veya tüm node process'lerini öldür
pkill -f node
```

---

### Sorun: pnpm workspace resolution hatası

**Sebep**: Paket referansları güncel değil

**Çözüm**:
```bash
# Lock file'ı yeniden oluştur
rm pnpm-lock.yaml
pnpm install

# Veya sadece güncelle
pnpm install --force
```

---

## Performance Tips

### Turbo Cache

```bash
# Remote cache aktifleştir (Vercel ile)
npx turbo login
npx turbo link

# Local cache kullanımını kontrol et
du -sh .turbo
```

### Build Optimizasyonu

```bash
# Parallel build sayısını artır
TURBO_CONCURRENCY=10 pnpm build

# Sadece değişen paketleri build et
pnpm turbo run build --filter=[HEAD^1]
```

### Memory Optimizasyonu

```bash
# Node memory limit artır
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

---

## Yardım Alma

1. **Bu dokümantasyonu oku** - Çoğu sorunun cevabı burada
2. **GitHub Issues** - Bilinen sorunları kontrol et
3. **Team channel** - Slack/Discord'da sor
4. **Stack Overflow** - Genel teknik sorular için

### Log Toplama

Bir sorun bildirirken şunları ekle:

```bash
# Sistem bilgisi
node --version
pnpm --version
docker --version
supabase --version

# Error logları
pnpm [command] 2>&1 | tee error.log
```

