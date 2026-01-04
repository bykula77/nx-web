---
description: 'Provider implementations: Supabase, Cloudflare, Auth, external services.'
alwaysApply: false
globs: ['packages/providers/**/*']
---

# Providers Pattern

**Trigger:** Implementing external service wrappers

> ⛔ Providers = GENERIC SDK WRAPPERS. Business mapping in domain adapters.

## Structure

```
packages/providers/
├── providers-supabase/     # DB, Auth, Realtime
├── providers-cloudflare/   # R2, KV, Workers
├── providers-auth/         # Auth context, guards, RBAC
└── providers-[service]/    # External services (Stripe, etc.)
```

## Provider vs Domain Adapter

```
Domain Adapter (packages/domains/*/adapters/)
  ├── Maps domain DTO → provider params
  ├── Maps provider response → domain entity
  └── Applies business rules
         │
         ▼
Provider (packages/providers-*)
  └── Generic SDK wrapper (no business logic)
```

---

## New Provider Template

### 1. Package Structure

```
providers-[name]/src/
├── client/[name].client.ts
├── hooks/use[Name].ts       # If React needed
├── webhooks/[name].webhook.ts  # If webhooks
├── types/[name].types.ts
└── index.ts
```

### 2. Config with Zod

```typescript
const ConfigSchema = z.object({
  apiKey: z.string().min(1),
  secretKey: z.string().min(1),
  webhookSecret: z.string().optional(),
});

function loadConfig(): Config {
  const result = ConfigSchema.safeParse({ apiKey: process.env.API_KEY, ... });
  if (!result.success) throw new Error(result.error.message);
  return result.data;
}
```

### 3. Client Class

```typescript
class [Name]Client {
  constructor(config?: Partial<Config>) {
    this.config = config ? { ...loadConfig(), ...config } : loadConfig();
    this.client = new SDKClient(this.config.apiKey);
  }

  async createResource(params): Promise<Result<Resource>> {
    try {
      const resource = await this.client.resources.create(params);
      return ok(resource);
    } catch (error) {
      return err(this.mapError(error));
    }
  }

  verifyWebhook(payload: string, signature: string): Result<Event> { ... }
  private mapError(error: unknown): string { ... }
}
```

### 4. Webhook Handler

```typescript
class WebhookHandler {
  constructor(private handlers: Record<EventType, (data) => Promise<void>>) {}

  async handleRequest(request: Request): Promise<Response> {
    const signature = request.headers.get('x-signature');
    const payload = await request.text();
    const result = this.client.verifyWebhook(payload, signature);
    if (!result.success) return new Response('Invalid', { status: 400 });

    await this.handlers[result.data.type]?.(result.data);
    return new Response('OK', { status: 200 });
  }
}
```

### 5. React Hook

```typescript
const Context = createContext<Client | null>(null);

function Provider({ children }) {
  const client = useMemo(() => new BrowserSDK(PUBLIC_KEY), []);
  return <Context.Provider value={client}>{children}</Context.Provider>;
}

function use[Name]() {
  const client = useContext(Context);
  if (!client) throw new Error('Provider required');
  return client;
}
```

---

## Supabase Provider

### Client Types

| Client                 | Use          | Key                        |
| ---------------------- | ------------ | -------------------------- |
| `supabase` (browser)   | React app    | Anon, respects RLS         |
| `createServerClient()` | SSR          | Anon + access token        |
| `createAdminClient()`  | Workers/Edge | Service role, bypasses RLS |

```typescript
// Browser
export const supabase = createClient<Database>(URL, ANON_KEY);

// Server (SSR)
export function createServerClient(accessToken?: string) {
  return createClient(URL, ANON_KEY, {
    global: { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} },
  });
}

// Admin (bypasses RLS)
export function createAdminClient() {
  return createClient(URL, SERVICE_ROLE_KEY);
}
```

### Hooks

```typescript
function useSupabase() {
  const client = useContext(SupabaseContext);
  if (!client) throw new Error('SupabaseProvider required');
  return client;
}

function useSupabaseRealtime<T>({ table, event, onInsert, onUpdate, onDelete }) {
  useEffect(() => {
    const channel = supabase
      .channel(table)
      .on('postgres_changes', { event, schema: 'public', table }, (payload) => {
        if (payload.eventType === 'INSERT') onInsert?.(payload.new);
        if (payload.eventType === 'UPDATE') onUpdate?.({ old: payload.old, new: payload.new });
        if (payload.eventType === 'DELETE') onDelete?.(payload.old);
      })
      .subscribe();
    return () => channel.unsubscribe();
  }, [table, event]);
}
```

---

## Cloudflare R2

```typescript
class R2Client {
  constructor(config: { accountId, accessKeyId, secretAccessKey, bucket }) {
    this.client = new S3Client({ endpoint: `https://${accountId}.r2.cloudflarestorage.com`, ... });
  }

  async upload({ key, body, contentType }): Promise<Result<string>> { ... }
  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string | null> { ... }
  async delete(key: string): Promise<Result<void>> { ... }
  async deleteByPrefix(prefix: string): Promise<Result<void>> { ... }
  async list(prefix?: string): Promise<string[]> { ... }
}
```

---

## Cloudflare KV

```typescript
class KVClient {
  async get<T>(key: string): Promise<T | null> { ... }
  async set<T>(key: string, value: T, options?: { expirationTtl?: number }): Promise<Result<void>> { ... }
  async delete(key: string): Promise<Result<void>> { ... }
  async deleteByPrefix(prefix: string): Promise<Result<void>> { ... }
}

// Cache utility
class KVCache {
  async getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = await this.client.get<T>(key);
    if (cached) return cached;
    const value = await factory();
    await this.client.set(key, value, { expirationTtl: ttl });
    return value;
  }
}
```

---

## Auth Provider

```typescript
function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user); setIsLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user));
    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signOut = () => supabase.auth.signOut();

  return <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>;
}

function AuthGuard({ children, redirectTo = '/login' }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spin />;
  if (!user) return <Navigate to={redirectTo} />;
  return children;
}
```

---

## RBAC

```typescript
enum Role { ADMIN = 'admin', MANAGER = 'manager', USER = 'user' }
enum Permission { ORDER_VIEW = 'order:view', ORDER_CREATE = 'order:create', ... }

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.MANAGER]: [Permission.ORDER_VIEW, Permission.ORDER_CREATE, ...],
  [Role.USER]: [Permission.ORDER_VIEW],
};

const hasPermission = (role: Role, perm: Permission) => ROLE_PERMISSIONS[role]?.includes(perm);

function usePermission(permission: Permission): boolean {
  const role = useAuth().user?.user_metadata?.role ?? Role.USER;
  return hasPermission(role, permission);
}
```

---

## Webhook Worker

```typescript
// cloudflare/workers/stripe-webhook.ts
const handler = new StripeWebhookHandler({
  'customer.subscription.created': async (sub) => {
    const supabase = createAdminClient();
    await supabase.from('subscriptions').insert({ stripe_id: sub.id, status: sub.status });
  },
  'customer.subscription.updated': async (sub) => { ... },
});

export default { fetch: (req) => handler.handleRequest(req) };
```

---

## Rules

| Provider Does       | Provider Does NOT       |
| ------------------- | ----------------------- |
| Wrap SDK methods    | Map to domain entities  |
| Validate config     | Apply business rules    |
| Handle SDK errors   | Know about domains      |
| Return Result types | Transform business data |
