import { UserRole, UserStatus } from './user.enums';

/**
 * All available user roles
 */
export const USER_ROLES = Object.values(UserRole);

/**
 * All available user statuses
 */
export const USER_STATUSES = Object.values(UserStatus);

/**
 * Default role for new users
 */
export const DEFAULT_USER_ROLE = UserRole.USER;

/**
 * Default status for new users
 */
export const DEFAULT_USER_STATUS = UserStatus.ACTIVE;

/**
 * Role display names (Turkish)
 */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Yönetici',
  [UserRole.USER]: 'Kullanıcı',
  [UserRole.EDITOR]: 'Editör',
};

/**
 * Status display names (Turkish)
 */
export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'Aktif',
  [UserStatus.INACTIVE]: 'Pasif',
  [UserStatus.BANNED]: 'Yasaklı',
};

/**
 * Status colors for UI
 */
export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'green',
  [UserStatus.INACTIVE]: 'orange',
  [UserStatus.BANNED]: 'red',
};

/**
 * Role hierarchy (higher index = more permissions)
 */
export const ROLE_HIERARCHY: UserRole[] = [
  UserRole.USER,
  UserRole.EDITOR,
  UserRole.ADMIN,
];

/**
 * Password requirements
 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

/**
 * Pagination defaults
 */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

