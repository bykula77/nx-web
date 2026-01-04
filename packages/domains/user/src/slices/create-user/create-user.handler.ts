import type { IUserRepository } from '../../ports/user.repository.port';
import type { ServiceResult } from '../../ports/user.service.port';
import type { CreateUserCommand, CreateUserResult } from './create-user.command';
import { createUserSchema } from '../../types';
import { validateCreateUser } from './create-user.rules';

/**
 * Handle create user command
 */
export async function handleCreateUser(
  repository: IUserRepository,
  command: CreateUserCommand
): Promise<ServiceResult<CreateUserResult>> {
  // Validate schema
  const schemaResult = createUserSchema.safeParse(command);

  if (!schemaResult.success) {
    const firstError = schemaResult.error.errors[0]?.message ?? 'Doğrulama hatası';
    return {
      success: false,
      error: firstError,
      code: 'VALIDATION_ERROR',
    };
  }

  // Validate business rules
  const rulesResult = await validateCreateUser(repository, command);

  if (!rulesResult.valid) {
    return {
      success: false,
      error: rulesResult.error,
      code: rulesResult.code,
    };
  }

  try {
    // Create user
    const user = await repository.create({
      email: command.email,
      password: command.password,
      fullName: command.fullName,
      role: command.role,
      avatarUrl: command.avatarUrl,
      phone: command.phone,
      metadata: command.metadata,
    });

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
      error: error instanceof Error ? error.message : 'Kullanıcı oluşturulamadı',
      code: 'CREATE_FAILED',
    };
  }
}

