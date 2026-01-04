import { useQuery } from '@tanstack/react-query';
import type { ListUsersQuery } from './list-users.query';
import type { UserListDTO } from '../../types/user.dto';
import type { ServiceResult } from '../../ports/user.service.port';
import { userQueryKeys } from '../create-user/useCreateUser';

/**
 * List users query function type
 */
type ListUsersFn = (query: ListUsersQuery) => Promise<ServiceResult<UserListDTO>>;

/**
 * useListUsers hook options
 */
interface UseListUsersOptions {
  enabled?: boolean;
}

/**
 * Hook for listing users
 */
export function useListUsers(
  listUsersFn: ListUsersFn,
  query: ListUsersQuery = {},
  options?: UseListUsersOptions
) {
  return useQuery({
    queryKey: userQueryKeys.list(query as Record<string, unknown>),
    queryFn: async () => {
      const result = await listUsersFn(query);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    keepPreviousData: true,
    enabled: options?.enabled ?? true,
  });
}

