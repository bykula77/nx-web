import type { IUserRepository } from '../../ports/user.repository.port';
import type { ServiceResult } from '../../ports/user.service.port';
import type { UpdateUserCommand, UpdateUserResult } from './update-user.command';
import { updateUserSchema } from '../../types';
import { validateUpdateUser } from './update-user.rules';

/**
 * Handle update user command
 */
export async function handleUpdateUser(
  repository: IUserRepository,
  command: UpdateUserCommand
): Promise<ServiceResult<UpdateUserResult>> {
  // Validate schema (exclude id from schema validation)
  const { id, ...updateData } = command;
  const schemaResult = updateUserSchema.safeParse(updateData);

  if (!schemaResult.success) {
    const firstError = schemaResult.error.errors[0]?.message ?? 'Doğrulama hatası';
    return {
      success: false,
      error: firstError,
      code: 'VALIDATION_ERROR',
    };
  }

  // Validate business rules
  const rulesResult = await validateUpdateUser(repository, command);

  if (!rulesResult.valid) {
    return {
      success: false,
      error: rulesResult.error,
      code: rulesResult.code,
    };
  }

  try {
    // Update user
    const user = await repository.update(id, updateData);

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Kullanıcı güncellenemedi',
      code: 'UPDATE_FAILED',
    };
  }
}

