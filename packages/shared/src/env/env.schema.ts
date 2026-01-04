import { z } from 'zod';

/**
 * Server-side environment variables schema
 * These are sensitive and should never be exposed to the client
 */
export const serverEnvSchema = z.object({
  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  SUPABASE_DB_URL: z.string().url('SUPABASE_DB_URL must be a valid URL'),

  // Cloudflare
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_API_TOKEN: z.string().optional(),
  CLOUDFLARE_R2_ENDPOINT: z.string().url().optional(),
  CLOUDFLARE_R2_BUCKET_NAME: z.string().optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().optional(),

  // Sanity (server-side token)
  SANITY_API_TOKEN: z.string().optional(),
});

/**
 * Client-side environment variables schema
 * These are safe to expose to the browser (prefixed with NEXT_PUBLIC_ or PUBLIC_)
 */
export const clientEnvSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),

  // Sanity
  SANITY_PROJECT_ID: z.string().optional(),
  SANITY_DATASET: z.string().default('production'),
  SANITY_API_VERSION: z.string().default('2024-01-01'),

  // App URLs
  APP_URL: z.string().url().optional(),
  BACKOFFICE_URL: z.string().url().optional(),
  CLIENT_PANEL_URL: z.string().url().optional(),
});

/**
 * Combined schema for full environment validation
 */
export const envSchema = serverEnvSchema.merge(clientEnvSchema);

// Type exports
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type Env = z.infer<typeof envSchema>;
