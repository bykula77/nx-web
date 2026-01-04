import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateUserCommand, CreateUserResult } from './create-user.command';
import type { ServiceResult } from '../../ports/user.service.port';

/**
 * Query keys for user domain
 */
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...userQueryKeys.lists(), filters] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

/**
 * Create user mutation function type
 */
type CreateUserFn = (command: CreateUserCommand) => Promise<ServiceResult<CreateUserResult>>;

/**
 * useCreateUser hook options
 */
interface UseCreateUserOptions {
  onSuccess?: (data: CreateUserResult) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for creating a user
 */
export function useCreateUser(
  createUserFn: CreateUserFn,
  options?: UseCreateUserOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserFn,
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate user list queries
        queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
        options?.onSuccess?.(result.data);
      } else {
        options?.onError?.(result.error);
      }
    },
    onError: (error: Error) => {
      options?.onError?.(error.message);
    },
  });
}

