import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

let adminClient: SupabaseClient<Database> | null = null;

/**
 * Get Supabase admin client (singleton)
 * Uses service_role key - ONLY use in server-side code!
 *
 * ⚠️ WARNING: This client bypasses Row Level Security (RLS)
 * Never expose this client to the browser
 */
export function getSupabaseAdminClient(): SupabaseClient<Database> {
  // Prevent usage in browser
  if (typeof window !== 'undefined') {
    throw new Error(
      'getSupabaseAdminClient cannot be used in browser context. It uses the service_role key which must be kept secret.'
    );
  }

  if (adminClient) {
    return adminClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required'
    );
  }

  adminClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

/**
 * Reset admin client (useful for testing)
 */
export function resetAdminClient(): void {
  adminClient = null;
}

