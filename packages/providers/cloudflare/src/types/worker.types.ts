import type { KVNamespaceBinding } from './kv.types';

/**
 * Generic Worker environment
 */
export interface WorkerEnv {
  [key: string]: unknown;
}

/**
 * Worker request
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
 * Worker response
 */
export interface WorkerResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: Record<string, unknown>;
}

/**
 * Worker execution context
 */
export interface WorkerContext {
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
}

/**
 * Worker handler type
 */
export type WorkerHandler<TEnv = WorkerEnv> = (
  request: Request,
  env: TEnv,
  ctx: WorkerContext
) => Response | Promise<Response>;

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

/**
 * Route handler
 */
export interface RouteHandler<TEnv = WorkerEnv> {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | '*';
  handler: WorkerHandler<TEnv>;
}

/**
 * Middleware function
 */
export type Middleware<TEnv = WorkerEnv> = (
  request: Request,
  env: TEnv,
  ctx: WorkerContext,
  next: () => Promise<Response>
) => Response | Promise<Response>;

/**
 * JSON response helper
 */
export function jsonResponse<T>(
  data: T,
  status = 200,
  headers?: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

/**
 * Error response helper
 */
export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown
): Response {
  return jsonResponse(
    {
      success: false,
      error: { code, message, details },
    },
    status
  );
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, meta?: Record<string, unknown>): Response {
  return jsonResponse({
    success: true,
    data,
    meta,
  });
}

/**
 * CORS headers helper
 */
export function corsHeaders(config: CORSConfig): Record<string, string> {
  const origin = Array.isArray(config.allowOrigin)
    ? config.allowOrigin.join(', ')
    : config.allowOrigin || '*';

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': (config.allowMethods || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']).join(', '),
    'Access-Control-Allow-Headers': (config.allowHeaders || ['Content-Type', 'Authorization']).join(', '),
    'Access-Control-Expose-Headers': (config.exposeHeaders || []).join(', '),
    'Access-Control-Max-Age': String(config.maxAge || 86400),
    ...(config.credentials && { 'Access-Control-Allow-Credentials': 'true' }),
  };
}

