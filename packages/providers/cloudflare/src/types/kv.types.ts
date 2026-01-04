/**
 * KV Namespace binding interface
 * Compatible with Cloudflare Workers KV API
 */
export interface KVNamespaceBinding {
  get(key: string, type: 'text'): Promise<string | null>;
  get(key: string, type: 'json'): Promise<unknown | null>;
  get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>;
  get(key: string, type: 'stream'): Promise<ReadableStream | null>;

  put(
    key: string,
    value: string | ArrayBuffer | ReadableStream,
    options?: {
      expiration?: number;
      expirationTtl?: number;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void>;

  delete(key: string): Promise<void>;

  list(options?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{
    keys: { name: string; expiration?: number; metadata?: unknown }[];
    cursor?: string;
    list_complete: boolean;
  }>;

  getWithMetadata(
    key: string,
    type: 'text'
  ): Promise<{ value: string | null; metadata: unknown | null }>;
  getWithMetadata(
    key: string,
    type: 'json'
  ): Promise<{ value: unknown | null; metadata: unknown | null }>;
  getWithMetadata(
    key: string,
    type: 'arrayBuffer'
  ): Promise<{ value: ArrayBuffer | null; metadata: unknown | null }>;
}

/**
 * KV value types
 */
export type KVValue = string | ArrayBuffer | ReadableStream | null;

/**
 * KV list options
 */
export interface KVListOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
}

/**
 * KV put options
 */
export interface KVPutOptions {
  /**
   * Unix timestamp (seconds) when the key should expire
   */
  expiration?: number;

  /**
   * Time-to-live in seconds
   */
  expirationTtl?: number;

  /**
   * Metadata to store with the key
   */
  metadata?: Record<string, unknown>;
}

/**
 * KV get options
 */
export interface KVGetOptions {
  /**
   * Return type
   */
  type?: 'text' | 'json' | 'arrayBuffer' | 'stream';

  /**
   * Cache TTL for edge caching
   */
  cacheTtl?: number;
}

/**
 * KV key info
 */
export interface KVKeyInfo {
  name: string;
  expiration?: number;
  metadata?: Record<string, unknown>;
}

/**
 * KV list result
 */
export interface KVListResult {
  keys: KVKeyInfo[];
  cursor?: string;
  list_complete: boolean;
}

