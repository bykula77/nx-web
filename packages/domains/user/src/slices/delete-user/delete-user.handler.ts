import type { IUserRepository } from '../../ports/user.repository.port';
import type { ServiceResult } from '../../ports/user.service.port';
import type { DeleteUserCommand, DeleteUserResult } from './delete-user.command';
import { validateDeleteUser } from './delete-user.rules';

/**
 * Handle delete user command
 */
export async function handleDeleteUser(
  repository: IUserRepository,
  command: DeleteUserCommand
): Promise<ServiceResult<DeleteUserResult>> {
  // Validate business rules
  const rulesResult = await validateDeleteUser(repository, command);

  if (!rulesResult.valid) {
    return {
      success: false,
      error: rulesResult.error,
      code: rulesResult.code,
    };
  }

  try {
    // Delete user
    await repository.delete(command.id);

    return {
      success: true,
      data: {
        id: command.id,
        deleted: true,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Kullanıcı silinemedi',
      code: 'DELETE_FAILED',
    };
  }
}

