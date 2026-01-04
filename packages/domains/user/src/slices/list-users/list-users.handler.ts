import type { IUserRepository } from '../../ports/user.repository.port';
import type { ServiceResult } from '../../ports/user.service.port';
import type { UserListDTO } from '../../types/user.dto';
import type { ListUsersQuery } from './list-users.query';
import { toUserListItems } from '../../shared/user.mappers';
import { DEFAULT_PAGE_SIZE } from '../../types';

/**
 * Handle list users query
 */
export async function handleListUsers(
  repository: IUserRepository,
  query: ListUsersQuery = {}
): Promise<ServiceResult<UserListDTO>> {
  try {
    const page = query.pagination?.page ?? 1;
    const pageSize = query.pagination?.pageSize ?? DEFAULT_PAGE_SIZE;

    const { items, total } = await repository.findAll(
      query.filters,
      query.pagination
    );

    const totalPages = Math.ceil(total / pageSize);

    return {
      success: true,
      data: {
        items: toUserListItems(items),
        total,
        page,
        pageSize,
        totalPages,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Kullanıcılar listelenemedi',
      code: 'LIST_FAILED',
    };
  }
}

