import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';
import { toAppError } from '../helpers/error.handler';
import type { Database } from '../types/database.types';

type TableName = keyof Database['public']['Tables'];

export interface UseSupabaseQueryOptions<T> {
  /**
   * Table name to query
   */
  table: TableName;

  /**
   * Select columns (default: '*')
   */
  select?: string;

  /**
   * Filter function to apply to the query
   */
  filter?: (query: ReturnType<ReturnType<typeof useSupabase>['from']>) => unknown;

  /**
   * Order by configuration
   */
  orderBy?: {
    column: string;
    ascending?: boolean;
  };

  /**
   * Pagination
   */
  range?: {
    from: number;
    to: number;
  };

  /**
   * Single record mode
   */
  single?: boolean;

  /**
   * Additional query options
   */
  queryOptions?: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'>;
}

/**
 * Generic Supabase query hook
 * Uses TanStack Query for caching and state management
 */
export function useSupabaseQuery<T = unknown>({
  table,
  select = '*',
  filter,
  orderBy,
  range,
  single = false,
  queryOptions,
}: UseSupabaseQueryOptions<T>) {
  const supabase = useSupabase();

  return useQuery<T[], Error>({
    queryKey: ['supabase', table, { select, filter: filter?.toString(), orderBy, range, single }],
    queryFn: async () => {
      let query = supabase.from(table).select(select);

      // Apply filter if provided
      if (filter) {
        query = filter(query) as typeof query;
      }

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }

      // Apply pagination
      if (range) {
        query = query.range(range.from, range.to);
      }

      // Execute query
      const { data, error } = single
        ? await query.single()
        : await query;

      if (error) {
        throw toAppError(error);
      }

      return (single ? [data] : data) as T[];
    },
    ...queryOptions,
  });
}

