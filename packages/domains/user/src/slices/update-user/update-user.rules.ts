import type { IUserRepository } from '../../ports/user.repository.port';
import type { UpdateUserCommand } from './update-user.command';

/**
 * Rule result type
 */
export type RuleResult =
  | { valid: true }
  | { valid: false; error: string; code: string };

/**
 * Check if user exists
 */
export async function userMustExist(
  repository: IUserRepository,
  userId: string
): Promise<RuleResult> {
  const user = await repository.findById(userId);

  if (!user) {
    return {
      valid: false,
      error: 'Kullanıcı bulunamadı',
      code: 'USER_NOT_FOUND',
    };
  }

  return { valid: true };
}

/**
 * Check if email is unique (excluding current user)
 */
export async function emailMustBeUniqueForUpdate(
  repository: IUserRepository,
  email: string,
  userId: string
): Promise<RuleResult> {
  const exists = await repository.emailExists(email, userId);

  if (exists) {
    return {
      valid: false,
      error: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor',
      code: 'EMAIL_EXISTS',
    };
  }

  return { valid: true };
}

/**
 * Validate all update user rules
 */
export async function validateUpdateUser(
  repository: IUserRepository,
  command: UpdateUserCommand
): Promise<RuleResult> {
  // Check user exists
  const existsResult = await userMustExist(repository, command.id);
  if (!existsResult.valid) {
    return existsResult;
  }

  // Check email uniqueness if email is being updated
  if (command.email) {
    const emailResult = await emailMustBeUniqueForUpdate(
      repository,
      command.email,
      command.id
    );
    if (!emailResult.valid) {
      return emailResult;
    }
  }

  return { valid: true };
}

