import type { UserRole } from '../../types';

/**
 * Create user command
 */
export interface CreateUserCommand {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  avatarUrl?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create user command result
 */
export interface CreateUserResult {
  id: string;
  email: string;
  fullName: string;
}

