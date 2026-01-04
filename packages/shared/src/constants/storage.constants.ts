/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  // Auth
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',

  // Preferences
  THEME: 'theme',
  LOCALE: 'locale',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',

  // Cache
  CACHE_PREFIX: 'cache_',

  // Session
  SESSION_ID: 'session_id',
  LAST_ACTIVITY: 'last_activity',
} as const;

/**
 * Session storage keys
 */
export const SESSION_STORAGE_KEYS = {
  REDIRECT_URL: 'redirect_url',
  FORM_DRAFT: 'form_draft',
} as const;

/**
 * Cookie names
 */
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  SESSION_ID: 'session_id',
} as const;

