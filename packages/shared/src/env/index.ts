// Schemas
export {
  serverEnvSchema,
  clientEnvSchema,
  envSchema,
  type ServerEnv,
  type ClientEnv,
  type Env,
} from './env.schema';

// Server environment (only import in server-side code)
export { serverEnv } from './env.server';

// Client environment (safe for browser)
export { clientEnv } from './env.client';

