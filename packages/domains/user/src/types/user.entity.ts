import { UserRole, UserStatus } from './user.enums';

/**
 * User entity interface
 * Represents a user in the system
 */
export interface User {
  /** Unique identifier */
  id: string;

  /** User email address */
  email: string;

  /** User's full name */
  fullName: string;

  /** User role */
  role: UserRole;

  /** User status */
  status: UserStatus;

  /** Avatar URL (optional) */
  avatarUrl?: string;

  /** Phone number (optional) */
  phone?: string;

  /** User metadata */
  metadata?: Record<string, unknown>;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;

  /** Last login timestamp (optional) */
  lastLoginAt?: Date;
}

/**
 * User with password (for internal use only)
 */
export interface UserWithPassword extends User {
  passwordHash: string;
}

