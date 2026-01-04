import type { UserRole, UserStatus } from '../../types';

/**
 * Update user command
 */
export interface UpdateUserCommand {
  id: string;
  email?: string;
  fullName?: string;
  role?: UserRole;
  status?: UserStatus;
  avatarUrl?: string | null;
  phone?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Update user result
 */
export interface UpdateUserResult {
  id: string;
  email: string;
  fullName: string;
}

