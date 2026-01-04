import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let testClient: SupabaseClient | null = null;

/**
 * Test database configuration
 */
interface TestDatabaseConfig {
  url?: string;
  anonKey?: string;
  serviceRoleKey?: string;
}

/**
 * Setup test database client
 */
export function setupTestDatabase(config?: TestDatabaseConfig): SupabaseClient {
  const url = config?.url || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    config?.serviceRoleKey ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    config?.anonKey ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase URL and key are required for test database setup');
  }

  testClient = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return testClient;
}

/**
 * Get the test client
 */
export function getTestClient(): SupabaseClient {
  if (!testClient) {
    return setupTestDatabase();
  }
  return testClient;
}

/**
 * Cleanup test database
 * Truncates specified tables or all test data
 */
export async function cleanupTestDatabase(tables?: string[]): Promise<void> {
  const client = getTestClient();

  if (tables && tables.length > 0) {
    for (const table of tables) {
      await client.from(table).delete().neq('id', '');
    }
  }
}

/**
 * Seed database with test data
 */
export async function seedDatabase<T extends Record<string, unknown>>(
  table: string,
  data: T | T[]
): Promise<T[]> {
  const client = getTestClient();
  const records = Array.isArray(data) ? data : [data];

  const { data: inserted, error } = await client
    .from(table)
    .insert(records)
    .select();

  if (error) {
    throw new Error(`Failed to seed database: ${error.message}`);
  }

  return inserted as T[];
}

/**
 * Create a single test record
 */
export async function createTestRecord<T extends Record<string, unknown>>(
  table: string,
  data: T
): Promise<T> {
  const [record] = await seedDatabase(table, data);
  return record;
}

/**
 * Delete test records by IDs
 */
export async function deleteTestRecords(
  table: string,
  ids: string[]
): Promise<void> {
  const client = getTestClient();

  const { error } = await client.from(table).delete().in('id', ids);

  if (error) {
    throw new Error(`Failed to delete test records: ${error.message}`);
  }
}

/**
 * Execute operations within a transaction-like scope
 * Note: Supabase doesn't support client-side transactions,
 * so this is a cleanup helper
 */
export async function withTestData<T>(
  setup: () => Promise<{ data: T; cleanup: () => Promise<void> }>
): Promise<T> {
  const { data, cleanup } = await setup();

  // Register cleanup for after test
  if (typeof afterEach !== 'undefined') {
    afterEach(async () => {
      await cleanup();
    });
  }

  return data;
}

/**
 * Get test data by ID
 */
export async function getTestRecord<T>(
  table: string,
  id: string
): Promise<T | null> {
  const client = getTestClient();

  const { data, error } = await client
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data as T;
}

/**
 * Update test record
 */
export async function updateTestRecord<T extends Record<string, unknown>>(
  table: string,
  id: string,
  data: Partial<T>
): Promise<T> {
  const client = getTestClient();

  const { data: updated, error } = await client
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update test record: ${error.message}`);
  }

  return updated as T;
}

