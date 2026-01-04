import type { UserRole, UserStatus } from '../../types';

/**
 * List users query filters
 */
export interface ListUsersFilters {
  /** Search by email or name */
  search?: string;
  /** Filter by role */
  role?: UserRole;
  /** Filter by status */
  status?: UserStatus;
  /** Created after date */
  createdAfter?: Date;
  /** Created before date */
  createdBefore?: Date;
}

/**
 * List users query pagination
 */
export interface ListUsersPagination {
  /** Page number (1-based) */
  page?: number;
  /** Items per page */
  pageSize?: number;
  /** Sort field */
  sortBy?: 'email' | 'fullName' | 'createdAt' | 'updatedAt';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * List users query
 */
export interface ListUsersQuery {
  filters?: ListUsersFilters;
  pagination?: ListUsersPagination;
}

