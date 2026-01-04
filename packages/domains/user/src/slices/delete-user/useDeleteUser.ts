import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { DeleteUserCommand, DeleteUserResult } from './delete-user.command';
import type { ServiceResult } from '../../ports/user.service.port';
import { userQueryKeys } from '../create-user/useCreateUser';

/**
 * Delete user mutation function type
 */
type DeleteUserFn = (command: DeleteUserCommand) => Promise<ServiceResult<DeleteUserResult>>;

/**
 * useDeleteUser hook options
 */
interface UseDeleteUserOptions {
  onSuccess?: (data: DeleteUserResult) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for deleting a user
 */
export function useDeleteUser(
  deleteUserFn: DeleteUserFn,
  options?: UseDeleteUserOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserFn,
    onSuccess: (result, variables) => {
      if (result.success) {
        // Remove user from cache
        queryClient.removeQueries({
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

