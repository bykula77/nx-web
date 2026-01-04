import type { KVNamespaceBinding, KVPutOptions } from '../types';
import { kvGet, kvPut, kvDelete, kvList } from './kv.client';

/**
 * Common cache TTL values in seconds
 */
export const CACHE_TTL = {
  /** 1 minute */
  SHORT: 60,
  /** 5 minutes */
  MEDIUM: 300,
  /** 1 hour */
  LONG: 3600,
  /** 1 day */
  DAY: 86400,
  /** 1 week */
  WEEK: 604800,
  /** 1 month (30 days) */
  MONTH: 2592000,
} as const;

/**
 * Cache key prefix for organization
 */
const CACHE_PREFIX = 'cache:';

/**
 * Get a cache key with prefix
 */
export function getCacheKey(key: string, namespace?: string): string {
  const prefix = namespace ? `${CACHE_PREFIX}${namespace}:` : CACHE_PREFIX;
  return `${prefix}${key}`;
}

/**
 * Cache wrapper - get from cache or fetch and cache
 */
export async function withCache<T>(
  namespace: KVNamespaceBinding,
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number;
    cacheNamespace?: string;
    forceRefresh?: boolean;
  }
): Promise<T> {
  const cacheKey = getCacheKey(key, options?.cacheNamespace);
  const { ttl = CACHE_TTL.MEDIUM, forceRefresh = false } = options || {};

  // Try to get from cache first (unless forced refresh)
  if (!forceRefresh) {
    const cached = await kvGet<T>(namespace, cacheKey, 'json');
    if (cached !== null) {
      return cached;
    }
  }

  // Fetch fresh data
  const data = await fetcher();

  // Cache the result
  await kvPut(namespace, cacheKey, JSON.stringify(data), {
    expirationTtl: ttl,
  });

  return data;
}

/**
 * Invalidate a specific cache key
 */
export async function invalidateCache(
  namespace: KVNamespaceBinding,
  key: string,
  cacheNamespace?: string
): Promise<void> {
  const cacheKey = getCacheKey(key, cacheNamespace);
  await kvDelete(namespace, cacheKey);
}

/**
 * Invalidate all cache keys matching a pattern (prefix)
 */
export async function invalidateCachePattern(
  namespace: KVNamespaceBinding,
  pattern: string,
  cacheNamespace?: string
): Promise<number> {
  const prefix = getCacheKey(pattern, cacheNamespace);
  let deletedCount = 0;
  let cursor: string | undefined;

  do {
    const result = await kvList(namespace, {
      prefix,
      limit: 1000,
      cursor,
    });

    const keysToDelete = result.keys.map((k) => k.name);

    if (keysToDelete.length > 0) {
      await Promise.all(keysToDelete.map((key) => kvDelete(namespace, key)));
      deletedCount += keysToDelete.length;
    }

    cursor = result.list_complete ? undefined : result.cursor;
  } while (cursor);

  return deletedCount;
}

/**
 * Set a cache value with TTL
 */
export async function setCache<T>(
  namespace: KVNamespaceBinding,
  key: string,
  value: T,
  options?: {
    ttl?: number;
    cacheNamespace?: string;
  }
): Promise<void> {
  const cacheKey = getCacheKey(key, options?.cacheNamespace);
  const { ttl = CACHE_TTL.MEDIUM } = options || {};

  await kvPut(namespace, cacheKey, JSON.stringify(value), {
    expirationTtl: ttl,
  });
}

/**
 * Get a cache value
 */
export async function getCache<T>(
  namespace: KVNamespaceBinding,
  key: string,
  cacheNamespace?: string
): Promise<T | null> {
  const cacheKey = getCacheKey(key, cacheNamespace);
  return kvGet<T>(namespace, cacheKey, 'json');
}

/**
 * Cache with stale-while-revalidate pattern
 * Returns stale data immediately while fetching fresh data in background
 */
export async function withSWRCache<T>(
  namespace: KVNamespaceBinding,
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number;
    staleTtl?: number;
    cacheNamespace?: string;
  }
): Promise<{ data: T; isStale: boolean }> {
  const cacheKey = getCacheKey(key, options?.cacheNamespace);
  const metaKey = `${cacheKey}:meta`;
  const { ttl = CACHE_TTL.MEDIUM, staleTtl = CACHE_TTL.LONG } = options || {};

  // Get cached data and metadata
  const [cached, meta] = await Promise.all([
    kvGet<T>(namespace, cacheKey, 'json'),
    kvGet<{ cachedAt: number }>(namespace, metaKey, 'json'),
  ]);

  const now = Date.now();
  const cachedAt = meta?.cachedAt || 0;
  const age = (now - cachedAt) / 1000;

  // Cache is fresh
  if (cached !== null && age < ttl) {
    return { data: cached, isStale: false };
  }

  // Cache is stale but usable
  if (cached !== null && age < staleTtl) {
    // Revalidate in background (fire and forget)
    fetcher().then(async (data) => {
      await Promise.all([
        kvPut(namespace, cacheKey, JSON.stringify(data), { expirationTtl: staleTtl }),
        kvPut(namespace, metaKey, JSON.stringify({ cachedAt: Date.now() }), { expirationTtl: staleTtl }),
      ]);
    });

    return { data: cached, isStale: true };
  }

  // No cache or expired, fetch fresh
  const data = await fetcher();

  await Promise.all([
    kvPut(namespace, cacheKey, JSON.stringify(data), { expirationTtl: staleTtl }),
    kvPut(namespace, metaKey, JSON.stringify({ cachedAt: Date.now() }), { expirationTtl: staleTtl }),
  ]);

  return { data, isStale: false };
}

