import type { KVNamespaceBinding, KVValue, KVListOptions, KVPutOptions } from '../types';

/**
 * KV Client wrapper for Cloudflare KV operations
 * Works with both Workers runtime and REST API
 */
export interface KVClient {
  get: <T = string>(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' }) => Promise<T | null>;
  put: (key: string, value: string | ArrayBuffer | ReadableStream, options?: KVPutOptions) => Promise<void>;
  delete: (key: string) => Promise<void>;
  list: (options?: KVListOptions) => Promise<{ keys: { name: string; expiration?: number; metadata?: unknown }[]; cursor?: string; list_complete: boolean }>;
  getWithMetadata: <T = string, M = unknown>(key: string) => Promise<{ value: T | null; metadata: M | null }>;
}

/**
 * Create KV client from Workers binding
 */
export function createKVClient(namespace: KVNamespaceBinding): KVClient {
  return {
    get: async <T = string>(
      key: string,
      options?: { type?: 'text' | 'json' | 'arrayBuffer' }
    ): Promise<T | null> => {
      const type = options?.type || 'text';

      switch (type) {
        case 'json':
          return namespace.get(key, 'json') as Promise<T | null>;
        case 'arrayBuffer':
          return namespace.get(key, 'arrayBuffer') as unknown as Promise<T | null>;
        default:
          return namespace.get(key, 'text') as unknown as Promise<T | null>;
      }
    },

    put: async (
      key: string,
      value: string | ArrayBuffer | ReadableStream,
      options?: KVPutOptions
    ): Promise<void> => {
      await namespace.put(key, value, {
        expirationTtl: options?.expirationTtl,
        expiration: options?.expiration,
        metadata: options?.metadata,
      });
    },

    delete: async (key: string): Promise<void> => {
      await namespace.delete(key);
    },

    list: async (options?: KVListOptions) => {
      return namespace.list({
        prefix: options?.prefix,
        limit: options?.limit,
        cursor: options?.cursor,
      });
    },

    getWithMetadata: async <T = string, M = unknown>(
      key: string
    ): Promise<{ value: T | null; metadata: M | null }> => {
      const result = await namespace.getWithMetadata(key, 'text');
      return {
        value: result.value as T | null,
        metadata: result.metadata as M | null,
      };
    },
  };
}

/**
 * Direct KV operations using Workers binding
 * These are convenience functions for common operations
 */

/**
 * Get a value from KV
 */
export async function kvGet<T = string>(
  namespace: KVNamespaceBinding,
  key: string,
  type: 'text' | 'json' | 'arrayBuffer' = 'text'
): Promise<T | null> {
  const client = createKVClient(namespace);
  return client.get<T>(key, { type });
}

/**
 * Put a value in KV
 */
export async function kvPut(
  namespace: KVNamespaceBinding,
  key: string,
  value: string | ArrayBuffer | ReadableStream,
  options?: KVPutOptions
): Promise<void> {
  const client = createKVClient(namespace);
  await client.put(key, value, options);
}

/**
 * Delete a value from KV
 */
export async function kvDelete(
  namespace: KVNamespaceBinding,
  key: string
): Promise<void> {
  const client = createKVClient(namespace);
  await client.delete(key);
}

/**
 * List keys in KV
 */
export async function kvList(
  namespace: KVNamespaceBinding,
  options?: KVListOptions
) {
  const client = createKVClient(namespace);
  return client.list(options);
}

/**
 * Get value with metadata from KV
 */
export async function kvGetWithMetadata<T = string, M = unknown>(
  namespace: KVNamespaceBinding,
  key: string
): Promise<{ value: T | null; metadata: M | null }> {
  const client = createKVClient(namespace);
  return client.getWithMetadata<T, M>(key);
}

/**
 * Batch get multiple keys
 */
export async function kvGetMany<T = string>(
  namespace: KVNamespaceBinding,
  keys: string[],
  type: 'text' | 'json' = 'text'
): Promise<Map<string, T | null>> {
  const results = await Promise.all(
    keys.map(async (key) => {
      const value = await kvGet<T>(namespace, key, type);
      return [key, value] as [string, T | null];
    })
  );

  return new Map(results);
}

/**
 * Batch put multiple key-value pairs
 */
export async function kvPutMany(
  namespace: KVNamespaceBinding,
  entries: { key: string; value: string; options?: KVPutOptions }[]
): Promise<void> {
  await Promise.all(
    entries.map(({ key, value, options }) => kvPut(namespace, key, value, options))
  );
}

/**
 * Batch delete multiple keys
 */
export async function kvDeleteMany(
  namespace: KVNamespaceBinding,
  keys: string[]
): Promise<void> {
  await Promise.all(keys.map((key) => kvDelete(namespace, key)));
}

