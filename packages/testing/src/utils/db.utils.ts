import { getTestClient } from '../setup/supabase.setup';

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
    throw new Error(`Failed to seed ${table}: ${error.message}`);
  }

  return inserted as T[];
}

/**
 * Clean database tables
 */
export async function cleanDatabase(tables: string[]): Promise<void> {
  const client = getTestClient();

  for (const table of tables) {
    const { error } = await client.from(table).delete().neq('id', '');

    if (error) {
      console.warn(`Failed to clean ${table}: ${error.message}`);
    }
  }
}

/**
 * Create a single test record
 */
export async function createTestRecord<T extends Record<string, unknown>>(
  table: string,
  data: Partial<T>
): Promise<T> {
  const [record] = await seedDatabase(table, data as T);
  return record;
}

/**
 * Create multiple test records
 */
export async function createTestRecords<T extends Record<string, unknown>>(
  table: string,
  data: Partial<T>[]
): Promise<T[]> {
  return seedDatabase(table, data as T[]);
}

/**
 * Get a test record by ID
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
 * Update a test record
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
    throw new Error(`Failed to update ${table}: ${error.message}`);
  }

  return updated as T;
}

/**
 * Delete a test record
 */
export async function deleteTestRecord(table: string, id: string): Promise<void> {
  const client = getTestClient();

  const { error } = await client.from(table).delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete from ${table}: ${error.message}`);
  }
}

/**
 * Execute operations with automatic cleanup
 * Similar to a transaction - cleans up after test
 */
export async function withTransaction<T>(
  setup: () => Promise<{ result: T; cleanup: () => Promise<void> }>
): Promise<T> {
  const { result, cleanup } = await setup();

  // Register cleanup to run after test
  if (typeof afterEach !== 'undefined') {
    afterEach(async () => {
      await cleanup();
    });
  }

  return result;
}

/**
 * Create test data with automatic cleanup
 */
export function withTestRecords<T extends Record<string, unknown>>(
  table: string,
  data: Partial<T>[]
) {
  return withTransaction(async () => {
    const records = await createTestRecords<T>(table, data);
    const ids = records.map((r) => r.id as string);

    return {
      result: records,
      cleanup: async () => {
        await Promise.all(ids.map((id) => deleteTestRecord(table, id)));
      },
    };
  });
}

/**
 * Count records in a table
 */
export async function countRecords(
  table: string,
  filter?: Record<string, unknown>
): Promise<number> {
  const client = getTestClient();

  let query = client.from(table).select('*', { count: 'exact', head: true });

  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      query = query.eq(key, value);
    }
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(`Failed to count ${table}: ${error.message}`);
  }

  return count || 0;
}

/**
 * Check if a record exists
 */
export async function recordExists(table: string, id: string): Promise<boolean> {
  const record = await getTestRecord(table, id);
  return record !== null;
}

