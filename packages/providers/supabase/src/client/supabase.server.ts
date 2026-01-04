import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

/**
 * Cookie handler interface for server-side Supabase client
 * Implementations should be provided by the consuming application
 * based on their framework (Next.js, Remix, etc.)
 */
export interface CookieHandler {
  get: (name: string) => string | undefined | Promise<string | undefined>;
  set: (name: string, value: string, options: CookieOptions) => void | Promise<void>;
  remove: (name: string, options: CookieOptions) => void | Promise<void>;
}

/**
 * Create Supabase server client
 * Use this in server-side contexts (API routes, Server Components, etc.)
 *
 * @param cookieHandler - Cookie handler implementation from the consuming app
 * @returns Supabase client configured for server-side use
 *
 * @example
 * // In Next.js App Router (Server Component)
 * import { cookies } from 'next/headers';
 *
 * const cookieStore = cookies();
 * const supabase = createSupabaseServerClient({
 *   get: (name) => cookieStore.get(name)?.value,
 *   set: (name, value, options) => cookieStore.set(name, value, options),
 *   remove: (name, options) => cookieStore.set(name, '', { ...options, maxAge: 0 }),
 * });
 */
export function createSupabaseServerClient(
  cookieHandler: CookieHandler
): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required'
    );
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: cookieHandler.get,
      set: cookieHandler.set,
      remove: cookieHandler.remove,
    },
  });
}

