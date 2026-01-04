import type { PostgrestFilterBuilder } from '@supabase/supabase-js';

/**
 * Filter operators
 */
export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'in'
  | 'is'
  | 'not.is'
  | 'contains'
  | 'containedBy'
  | 'overlaps';

/**
 * Filter configuration
 */
export interface FilterConfig {
  column: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Apply filters to a Supabase query
 */
export function buildFilters<T>(
  query: PostgrestFilterBuilder<T, unknown, unknown>,
  filters: FilterConfig[]
): PostgrestFilterBuilder<T, unknown, unknown> {
  let result = query;

  for (const filter of filters) {
    const { column, operator, value } = filter;

    switch (operator) {
      case 'eq':
        result = result.eq(column, value);
        break;
      case 'neq':
        result = result.neq(column, value);
        break;
      case 'gt':
        result = result.gt(column, value);
        break;
      case 'gte':
        result = result.gte(column, value);
        break;
      case 'lt':
        result = result.lt(column, value);
        break;
      case 'lte':
        result = result.lte(column, value);
        break;
      case 'like':
        result = result.like(column, value as string);
        break;
      case 'ilike':
        result = result.ilike(column, value as string);
        break;
      case 'in':
        result = result.in(column, value as unknown[]);
        break;
      case 'is':
        result = result.is(column, value as null | boolean);
        break;
      case 'not.is':
        result = result.not(column, 'is', value);
        break;
      case 'contains':
        result = result.contains(column, value as unknown[]);
        break;
      case 'containedBy':
        result = result.containedBy(column, value as unknown[]);
        break;
      case 'overlaps':
        result = result.overlaps(column, value as unknown[]);
        break;
    }
  }

  return result;
}

/**
 * Convert a search object to filter configs
 */
export function objectToFilters(
  obj: Record<string, unknown>,
  options?: {
    /**
     * Columns to use ILIKE for (text search)
     */
    textSearchColumns?: string[];

    /**
     * Columns to exclude from filtering
     */
    excludeColumns?: string[];
  }
): FilterConfig[] {
  const filters: FilterConfig[] = [];
  const { textSearchColumns = [], excludeColumns = [] } = options || {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip excluded columns
    if (excludeColumns.includes(key)) continue;

    // Skip null/undefined values
    if (value === null || value === undefined || value === '') continue;

    // Determine operator
    let operator: FilterOperator = 'eq';

    if (textSearchColumns.includes(key) && typeof value === 'string') {
      operator = 'ilike';
      filters.push({ column: key, operator, value: `%${value}%` });
    } else if (Array.isArray(value)) {
      operator = 'in';
      filters.push({ column: key, operator, value });
    } else {
      filters.push({ column: key, operator, value });
    }
  }

  return filters;
}

