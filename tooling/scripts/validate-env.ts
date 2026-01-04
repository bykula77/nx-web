#!/usr/bin/env tsx
/**
 * Validate environment variables against defined schemas
 *
 * Usage: pnpm validate-env
 *
 * This script validates that all required environment variables
 * are present and correctly formatted.
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local first, then .env
const rootDir = resolve(__dirname, '../..');
const envLocalPath = resolve(rootDir, '.env.local');
const envPath = resolve(rootDir, '.env');

if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
  console.log('📄 Loaded .env.local\n');
} else if (existsSync(envPath)) {
  config({ path: envPath });
  console.log('📄 Loaded .env\n');
} else {
  console.warn('⚠️  No .env.local or .env file found\n');
}

// Define schemas inline to avoid import issues
const serverEnvSchema = z.object({
  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Required'),
  SUPABASE_DB_URL: z.string().url('Must be a valid URL'),
  // Cloudflare
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_API_TOKEN: z.string().optional(),
  CLOUDFLARE_R2_ENDPOINT: z.string().optional(),
  CLOUDFLARE_R2_BUCKET_NAME: z.string().optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().optional(),
  // Sanity
  SANITY_API_TOKEN: z.string().optional(),
});

const clientEnvSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Required'),
  // Sanity
  SANITY_PROJECT_ID: z.string().optional(),
  SANITY_DATASET: z.string().optional(),
  SANITY_API_VERSION: z.string().optional(),
  // App URLs
  APP_URL: z.string().optional(),
  BACKOFFICE_URL: z.string().optional(),
  CLIENT_PANEL_URL: z.string().optional(),
});

interface ValidationResult {
  name: string;
  valid: boolean;
  errors?: Record<string, string[]>;
}

function validateSchema(
  name: string,
  schema: z.ZodObject<z.ZodRawShape>,
  env: NodeJS.ProcessEnv
): ValidationResult {
  const result = schema.safeParse(env);

  if (result.success) {
    return { name, valid: true };
  }

  return {
    name,
    valid: false,
    errors: result.error.flatten().fieldErrors as Record<string, string[]>,
  };
}

function printResult(result: ValidationResult): void {
  if (result.valid) {
    console.log(`✅ ${result.name}: All variables valid`);
  } else {
    console.log(`❌ ${result.name}: Validation failed`);
    if (result.errors) {
      for (const [key, messages] of Object.entries(result.errors)) {
        console.log(`   • ${key}: ${messages.join(', ')}`);
      }
    }
  }
}

async function main(): Promise<void> {
  console.log('🔍 Validating environment variables...\n');

  const results: ValidationResult[] = [
    validateSchema('Server Environment', serverEnvSchema, process.env),
    validateSchema('Client Environment', clientEnvSchema, process.env),
  ];

  results.forEach(printResult);
  console.log('');

  const allValid = results.every((r) => r.valid);

  if (allValid) {
    console.log('✨ All environment variables are valid!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some environment variables are missing or invalid.');
    console.log('💡 Check .env.example for required variables.\n');
    process.exit(1);
  }
}

main();

