import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';
import { toAppError } from '../helpers/error.handler';
import type { Database } from '../types/database.types';

type TableName = keyof Database['public']['Tables'];

export interface UseSupabaseMutationOptions<TData, TVariables> {
  /**
   * Table name
   */
  table: TableName;

  /**
   * Invalidate queries after mutation
   */
  invalidateQueries?: string[][];

  /**
   * Additional mutation options
   */
  mutationOptions?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>;
}

/**
 * Generic Supabase insert mutation hook
 */
export function useSupabaseInsert<TData = unknown, TVariables = Record<string, unknown>>({
  table,
  invalidateQueries,
  mutationOptions,
}: UseSupabaseMutationOptions<TData, TVariables>) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (data) => {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data as Record<string, unknown>)
        .select()
        .single();

      if (error) {
        throw toAppError(error);
      }

      return result as TData;
    },
    onSuccess: () => {
      // Invalidate related queries
      if (invalidateQueries) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      } else {
        // Default: invalidate all queries for this table
        queryClient.invalidateQueries({ queryKey: ['supabase', table] });
      }
    },
    ...mutationOptions,
  });
}

/**
 * Generic Supabase update mutation hook
 */
export function useSupabaseUpdate<
  TData = unknown,
  TVariables = { id: string; data: Record<string, unknown> },
>({
  table,
  invalidateQueries,
  mutationOptions,
}: UseSupabaseMutationOptions<TData, TVariables>) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      const { id, data } = variables as { id: string; data: Record<string, unknown> };

      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw toAppError(error);
      }

      return result as TData;
    },
    onSuccess: () => {
      if (invalidateQueries) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ['supabase', table] });
      }
    },
    ...mutationOptions,
  });
}

/**
 * Generic Supabase delete mutation hook
 */
export function useSupabaseDelete<TData = unknown, TVariables = { id: string }>({
  table,
  invalidateQueries,
  mutationOptions,
}: UseSupabaseMutationOptions<TData, TVariables>) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      const { id } = variables as { id: string };

      const { data: result, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw toAppError(error);
      }

      return result as TData;
    },
    onSuccess: () => {
      if (invalidateQueries) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ['supabase', table] });
      }
    },
    ...mutationOptions,
  });
}

/**
 * Combined mutation hook with all operations
 */
export function useSupabaseMutation<TData = unknown>(
  options: Omit<UseSupabaseMutationOptions<TData, unknown>, 'mutationOptions'>
) {
  const insert = useSupabaseInsert<TData>(options);
  const update = useSupabaseUpdate<TData>(options);
  const remove = useSupabaseDelete<TData>(options);

  return {
    insert,
    update,
    remove,
  };
}

