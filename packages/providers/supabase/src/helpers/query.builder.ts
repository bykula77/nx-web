import type { SupabaseClient, PostgrestFilterBuilder } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { calculateRange, type PaginationOptions } from './pagination.helper';
import { buildFilters, type FilterConfig } from './filter.helper';

type TableName = keyof Database['public']['Tables'];

/**
 * Type-safe query builder for Supabase
 */
export class QueryBuilder<T = unknown> {
  private _select = '*';
  private _filters: FilterConfig[] = [];
  private _orderBy: { column: string; ascending: boolean }[] = [];
  private _pagination?: PaginationOptions;
  private _single = false;

  constructor(
    private client: SupabaseClient<Database>,
    private table: TableName
  ) {}

  /**
   * Select specific columns
   */
  select(columns: string): this {
    this._select = columns;
    return this;
  }

  /**
   * Add equality filter
   */
  eq(column: string, value: unknown): this {
    this._filters.push({ column, operator: 'eq', value });
    return this;
  }

  /**
   * Add not equal filter
   */
  neq(column: string, value: unknown): this {
    this._filters.push({ column, operator: 'neq', value });
    return this;
  }

  /**
   * Add greater than filter
   */
  gt(column: string, value: unknown): this {
    this._filters.push({ column, operator: 'gt', value });
    return this;
  }

  /**
   * Add greater than or equal filter
   */
  gte(column: string, value: unknown): this {
    this._filters.push({ column, operator: 'gte', value });
    return this;
  }

  /**
   * Add less than filter
   */
  lt(column: string, value: unknown): this {
    this._filters.push({ column, operator: 'lt', value });
    return this;
  }

  /**
   * Add less than or equal filter
   */
  lte(column: string, value: unknown): this {
    this._filters.push({ column, operator: 'lte', value });
    return this;
  }

  /**
   * Add LIKE filter
   */
  like(column: string, pattern: string): this {
    this._filters.push({ column, operator: 'like', value: pattern });
    return this;
  }

  /**
   * Add ILIKE filter (case-insensitive LIKE)
   */
  ilike(column: string, pattern: string): this {
    this._filters.push({ column, operator: 'ilike', value: pattern });
    return this;
  }

  /**
   * Add IN filter
   */
  in(column: string, values: unknown[]): this {
    this._filters.push({ column, operator: 'in', value: values });
    return this;
  }

  /**
   * Add IS NULL filter
   */
  isNull(column: string): this {
    this._filters.push({ column, operator: 'is', value: null });
    return this;
  }

  /**
   * Add IS NOT NULL filter
   */
  isNotNull(column: string): this {
    this._filters.push({ column, operator: 'not.is', value: null });
    return this;
  }

  /**
   * Add ordering
   */
  orderBy(column: string, ascending = true): this {
    this._orderBy.push({ column, ascending });
    return this;
  }

  /**
   * Add pagination
   */
  paginate(options: PaginationOptions): this {
    this._pagination = options;
    return this;
  }

  /**
   * Return single result
   */
  single(): this {
    this._single = true;
    return this;
  }

  /**
   * Execute the query
   */
  async execute(): Promise<{ data: T | T[] | null; error: Error | null; count?: number }> {
    let query = this.client.from(this.table).select(this._select, {
      count: this._pagination ? 'exact' : undefined,
    });

    // Apply filters
    query = buildFilters(query, this._filters) as PostgrestFilterBuilder<
      Database['public'],
      Database['public']['Tables'][TableName]['Row'],
      unknown
    >;

    // Apply ordering
    for (const order of this._orderBy) {
      query = query.order(order.column, { ascending: order.ascending });
    }

    // Apply pagination
    if (this._pagination) {
      const { from, to } = calculateRange(this._pagination);
      query = query.range(from, to);
    }

    // Execute
    if (this._single) {
      const { data, error } = await query.single();
      return { data: data as T, error };
    }

    const { data, error, count } = await query;
    return { data: data as T[], error, count: count ?? undefined };
  }
}

