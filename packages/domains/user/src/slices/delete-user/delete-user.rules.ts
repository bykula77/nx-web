import type { IUserRepository } from '../../ports/user.repository.port';
import type { DeleteUserCommand } from './delete-user.command';
import { UserRole } from '../../types';

/**
 * Rule result type
 */
export type RuleResult =
  | { valid: true }
  | { valid: false; error: string; code: string };

/**
 * User cannot delete themselves
 */
export function cannotDeleteSelf(command: DeleteUserCommand): RuleResult {
  if (command.id === command.actorId) {
    return {
      valid: false,
      error: 'Kendi hesabınızı silemezsiniz',
      code: 'CANNOT_DELETE_SELF',
    };
  }

  return { valid: true };
}

/**
 * Cannot delete admin users (unless you are admin)
 */
export async function cannotDeleteAdmin(
  repository: IUserRepository,
  command: DeleteUserCommand
): Promise<RuleResult> {
  const [targetUser, actorUser] = await Promise.all([
    repository.findById(command.id),
    repository.findById(command.actorId),
  ]);

  if (!targetUser) {
    return {
      valid: false,
      error: 'Silinecek kullanıcı bulunamadı',
      code: 'USER_NOT_FOUND',
    };
  }

  if (!actorUser) {
    return {
      valid: false,
      error: 'İşlemi yapan kullanıcı bulunamadı',
      code: 'ACTOR_NOT_FOUND',
    };
  }

  // Only admins can delete other admins
  if (targetUser.role === UserRole.ADMIN && actorUser.role !== UserRole.ADMIN) {
    return {
      valid: false,
      error: 'Yönetici kullanıcıları silme yetkiniz yok',
      code: 'CANNOT_DELETE_ADMIN',
    };
  }

  return { valid: true };
}

/**
 * User must exist
 */
export async function userMustExistForDelete(
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
 * Validate all delete user rules
 */
export async function validateDeleteUser(
  repository: IUserRepository,
  command: DeleteUserCommand
): Promise<RuleResult> {
  // Check cannot delete self
  const selfResult = cannotDeleteSelf(command);
  if (!selfResult.valid) {
    return selfResult;
  }

  // Check admin deletion rules
  const adminResult = await cannotDeleteAdmin(repository, command);
  if (!adminResult.valid) {
    return adminResult;
  }

  return { valid: true };
}

