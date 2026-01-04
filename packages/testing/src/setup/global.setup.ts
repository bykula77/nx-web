import { vi } from 'vitest';

/**
 * Required environment variables for testing
 */
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

/**
 * Validate that all required environment variables are set
 */
export function validateTestEnv(): void {
  const missing: string[] = [];

  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `Warning: Missing environment variables for testing: ${missing.join(', ')}\n` +
        'Some tests may fail or be skipped.'
    );
  }
}

/**
 * Setup global mocks
 */
export function setupGlobalMocks(): void {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock IntersectionObserver
  const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

  // Mock ResizeObserver
  const mockResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  vi.stubGlobal('ResizeObserver', mockResizeObserver);

  // Mock scrollTo
  window.scrollTo = vi.fn();

  // Mock crypto.getRandomValues
  if (!globalThis.crypto) {
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        getRandomValues: (arr: Uint8Array) => {
          for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.floor(Math.random() * 256);
          }
          return arr;
        },
        randomUUID: () =>
          'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }),
      },
    });
  }
}

/**
 * Global setup for Vitest
 * This runs once before all tests
 */
export function globalSetup(): void {
  validateTestEnv();
  setupGlobalMocks();

  // Set test environment variables
  process.env.NODE_ENV = 'test';
}

/**
 * Global teardown for Vitest
 * This runs once after all tests
 */
export function globalTeardown(): void {
  vi.restoreAllMocks();
}

/**
 * Setup for each test file
 */
export function setupTestFile(): void {
  // Clear all mocks before each test
  vi.clearAllMocks();
}

