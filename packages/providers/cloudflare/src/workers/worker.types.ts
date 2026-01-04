import type { KVNamespace, R2Bucket } from '@cloudflare/workers-types';

/**
 * Worker environment bindings
 */
export interface WorkerEnv {
  // KV Namespaces
  KV?: KVNamespace;
  CACHE?: KVNamespace;
  SESSIONS?: KVNamespace;

  // R2 Buckets
  BUCKET?: R2Bucket;
  ASSETS?: R2Bucket;

  // Environment variables
  ENVIRONMENT?: 'development' | 'staging' | 'production';
  API_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;

  // Secrets
  JWT_SECRET?: string;
  API_KEY?: string;

  // Custom bindings can be extended
  [key: string]: unknown;
}

/**
 * Worker request with typed body
 */
export interface WorkerRequest<T = unknown> {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: T;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

/**
 * Worker response with typed data
 */
export interface WorkerResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    duration?: number;
    cached?: boolean;
    version?: string;
  };
}

/**
 * Worker execution context
 */
export interface WorkerContext {
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
}

/**
 * Worker handler function type
 */
export type WorkerHandler<TEnv extends WorkerEnv = WorkerEnv> = (
  request: Request,
  env: TEnv,
  ctx: WorkerContext
) => Response | Promise<Response>;

/**
 * Worker fetch handler with typed environment
 */
export interface WorkerModule<TEnv extends WorkerEnv = WorkerEnv> {
  fetch: WorkerHandler<TEnv>;
  scheduled?: (
    event: ScheduledEvent,
    env: TEnv,
    ctx: WorkerContext
  ) => void | Promise<void>;
}

/**
 * Scheduled event for cron triggers
 */
export interface ScheduledEvent {
  cron: string;
  scheduledTime: number;
}

/**
 * Worker route configuration
 */
export interface WorkerRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
  handler: (
    request: Request,
    env: WorkerEnv,
    ctx: WorkerContext,
    params?: Record<string, string>
  ) => Response | Promise<Response>;
}

/**
 * CORS configuration
 */
export interface CORSConfig {
  allowOrigin?: string | string[];
  allowMethods?: string[];
  allowHeaders?: string[];
  exposeHeaders?: string[];
  maxAge?: number;
  credentials?: boolean;
}

