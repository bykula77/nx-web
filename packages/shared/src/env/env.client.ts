import { clientEnvSchema, type ClientEnv } from './env.schema';

/**
 * Gets client environment variables from import.meta.env (Vite/Astro)
 * Falls back to process.env for SSR contexts
 */
function getClientEnvSource(): Record<string, string | undefined> {
  // Vite/Astro environment
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env as Record<string, string | undefined>;
  }

  // Node.js / SSR fallback
  if (typeof process !== 'undefined' && process.env) {
    return process.env as Record<string, string | undefined>;
  }

  return {};
}

/**
 * Validates and parses client-side environment variables
 * Safe to use in browser code
 *
 * @throws {ZodError} If validation fails
 */
function parseClientEnv(): ClientEnv {
  const envSource = getClientEnvSource();

  const result = clientEnvSchema.safeParse({
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: envSource.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: envSource.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // Sanity
    SANITY_PROJECT_ID: envSource.SANITY_PROJECT_ID,
    SANITY_DATASET: envSource.SANITY_DATASET,
    SANITY_API_VERSION: envSource.SANITY_API_VERSION,
    // App URLs
    APP_URL: envSource.APP_URL,
    BACKOFFICE_URL: envSource.BACKOFFICE_URL,
    CLIENT_PANEL_URL: envSource.CLIENT_PANEL_URL,
  });

  if (!result.success) {
    console.error('❌ Invalid client environment variables:');
    console.error(result.error.flatten().fieldErrors);
    throw new Error('Invalid client environment variables');
  }

  return result.data;
}

/**
 * Client environment variables
 * Safe to use in browser code - only contains public variables
 */
export const clientEnv = parseClientEnv();

// Re-export types
export type { ClientEnv } from './env.schema';

