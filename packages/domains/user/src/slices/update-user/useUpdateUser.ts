import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateUserCommand, UpdateUserResult } from './update-user.command';
import type { ServiceResult } from '../../ports/user.service.port';
import { userQueryKeys } from '../create-user/useCreateUser';

/**
 * Update user mutation function type
 */
type UpdateUserFn = (command: UpdateUserCommand) => Promise<ServiceResult<UpdateUserResult>>;

/**
 * useUpdateUser hook options
 */
interface UseUpdateUserOptions {
  onSuccess?: (data: UpdateUserResult) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for updating a user
 */
export function useUpdateUser(
  updateUserFn: UpdateUserFn,
  options?: UseUpdateUserOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserFn,
    onSuccess: (result, variables) => {
      if (result.success) {
        // Invalidate specific user query
        queryClient.invalidateQueries({
          queryKey: userQueryKeys.detail(variables.id),
        });
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

