import { serverEnvSchema, type ServerEnv } from './env.schema';

/**
 * Validates and parses server-side environment variables
 * This should only be imported in server-side code
 *
 * @throws {ZodError} If validation fails
 */
function parseServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid server environment variables:');
    console.error(result.error.flatten().fieldErrors);
    throw new Error('Invalid server environment variables');
  }

  return result.data;
}

/**
 * Server environment variables
 * Only access this in server-side code (API routes, server components, etc.)
 */
export const serverEnv = parseServerEnv();

// Re-export types
export type { ServerEnv } from './env.schema';

