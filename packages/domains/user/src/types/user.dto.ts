import type { User } from './user.entity';
import type { UserRole, UserStatus } from './user.enums';

/**
 * Create user DTO
 */
export interface CreateUserDTO {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  avatarUrl?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Update user DTO
 */
export interface UpdateUserDTO {
  email?: string;
  fullName?: string;
  role?: UserRole;
  status?: UserStatus;
  avatarUrl?: string | null;
  phone?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * User response DTO (without sensitive data)
 */
export interface UserResponseDTO {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

/**
 * User list item DTO (minimal data for lists)
 */
export interface UserListItemDTO {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

/**
 * User list response DTO
 */
export interface UserListDTO {
  items: UserListItemDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * User filter DTO
 */
export interface UserFilterDTO {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  createdAfter?: Date;
  createdBefore?: Date;
}

/**
 * User pagination DTO
 */
export interface UserPaginationDTO {
  page?: number;
  pageSize?: number;
  sortBy?: keyof User;
  sortOrder?: 'asc' | 'desc';
}

