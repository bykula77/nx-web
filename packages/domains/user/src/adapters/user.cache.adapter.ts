import type { User } from '../types/user.entity';

/**
 * Cache key prefixes
 */
const CACHE_KEYS = {
  USER_BY_ID: 'user:id:',
  USER_BY_EMAIL: 'user:email:',
  USER_LIST: 'user:list:',
} as const;

/**
 * Default TTL in seconds (5 minutes)
 */
const DEFAULT_TTL = 300;

/**
 * KV-like cache interface
 */
interface CacheStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

/**
 * User cache adapter
 * Provides caching helpers for user data
 */
export class UserCacheAdapter {
  constructor(
    private readonly cache: CacheStore,
    private readonly ttl: number = DEFAULT_TTL
  ) {}

  /**
   * Get user from cache by ID
   */
  async getUserById(id: string): Promise<User | null> {
    return this.cache.get<User>(`${CACHE_KEYS.USER_BY_ID}${id}`);
  }

  /**
   * Set user in cache by ID
   */
  async setUserById(user: User): Promise<void> {
    await this.cache.set(
      `${CACHE_KEYS.USER_BY_ID}${user.id}`,
      user,
      this.ttl
    );
  }

  /**
   * Get user from cache by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.cache.get<User>(`${CACHE_KEYS.USER_BY_EMAIL}${email.toLowerCase()}`);
  }

  /**
   * Set user in cache by email
   */
  async setUserByEmail(user: User): Promise<void> {
    await this.cache.set(
      `${CACHE_KEYS.USER_BY_EMAIL}${user.email.toLowerCase()}`,
      user,
      this.ttl
    );
  }

  /**
   * Invalidate user cache
   */
  async invalidateUser(user: User): Promise<void> {
    await Promise.all([
      this.cache.delete(`${CACHE_KEYS.USER_BY_ID}${user.id}`),
      this.cache.delete(`${CACHE_KEYS.USER_BY_EMAIL}${user.email.toLowerCase()}`),
    ]);
  }

  /**
   * Invalidate user by ID
   */
  async invalidateUserById(id: string): Promise<void> {
    await this.cache.delete(`${CACHE_KEYS.USER_BY_ID}${id}`);
  }

  /**
   * Get cached user list
   */
  async getUserList(cacheKey: string): Promise<User[] | null> {
    return this.cache.get<User[]>(`${CACHE_KEYS.USER_LIST}${cacheKey}`);
  }

  /**
   * Set user list in cache
   */
  async setUserList(cacheKey: string, users: User[]): Promise<void> {
    await this.cache.set(
      `${CACHE_KEYS.USER_LIST}${cacheKey}`,
      users,
      this.ttl
    );
  }

  /**
   * Invalidate all user list caches
   */
  async invalidateUserLists(): Promise<void> {
    // Note: This would require a pattern-based delete in a real KV store
    // For now, we assume lists are invalidated separately
  }

  /**
   * Create a cache key from filter parameters
   */
  static createListCacheKey(params: Record<string, unknown>): string {
    return JSON.stringify(params);
  }
}

