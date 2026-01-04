import type { IUserRepository } from '../../ports/user.repository.port';
import type { CreateUserCommand } from './create-user.command';
import { PASSWORD_MIN_LENGTH } from '../../types';

/**
 * Rule result type
 */
export type RuleResult =
  | { valid: true }
  | { valid: false; error: string; code: string };

/**
 * Check if email is unique
 */
export async function emailMustBeUnique(
  repository: IUserRepository,
  email: string
): Promise<RuleResult> {
  const exists = await repository.emailExists(email);

  if (exists) {
    return {
      valid: false,
      error: 'Bu e-posta adresi zaten kullanılıyor',
      code: 'EMAIL_EXISTS',
    };
  }

  return { valid: true };
}

/**
 * Check password minimum length
 */
export function passwordMustMeetMinLength(password: string): RuleResult {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır`,
      code: 'PASSWORD_TOO_SHORT',
    };
  }

  return { valid: true };
}

/**
 * Check password has uppercase letter
 */
export function passwordMustHaveUppercase(password: string): RuleResult {
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: 'Şifre en az bir büyük harf içermelidir',
      code: 'PASSWORD_NO_UPPERCASE',
    };
  }

  return { valid: true };
}

/**
 * Check password has lowercase letter
 */
export function passwordMustHaveLowercase(password: string): RuleResult {
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: 'Şifre en az bir küçük harf içermelidir',
      code: 'PASSWORD_NO_LOWERCASE',
    };
  }

  return { valid: true };
}

/**
 * Check password has number
 */
export function passwordMustHaveNumber(password: string): RuleResult {
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      error: 'Şifre en az bir rakam içermelidir',
      code: 'PASSWORD_NO_NUMBER',
    };
  }

  return { valid: true };
}

/**
 * Validate all password rules
 */
export function validatePassword(password: string): RuleResult {
  const rules = [
    passwordMustMeetMinLength,
    passwordMustHaveUppercase,
    passwordMustHaveLowercase,
    passwordMustHaveNumber,
  ];

  for (const rule of rules) {
    const result = rule(password);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
}

/**
 * Validate all create user rules
 */
export async function validateCreateUser(
  repository: IUserRepository,
  command: CreateUserCommand
): Promise<RuleResult> {
  // Check email uniqueness
  const emailResult = await emailMustBeUnique(repository, command.email);
  if (!emailResult.valid) {
    return emailResult;
  }

  // Check password
  const passwordResult = validatePassword(command.password);
  if (!passwordResult.valid) {
    return passwordResult;
  }

  return { valid: true };
}

