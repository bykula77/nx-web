/**
 * Unique identifier type
 */
export type ID = string;

/**
 * Timestamp type (ISO 8601 string or Date)
 */
export type Timestamp = string | Date;

/**
 * Unix timestamp in milliseconds
 */
export type UnixTimestamp = number;

/**
 * Makes a type nullable
 */
export type Nullable<T> = T | null;

/**
 * Makes a type optional (can be undefined)
 */
export type Optional<T> = T | undefined;

/**
 * Makes all properties of a type optional recursively
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Makes all properties of a type readonly recursively
 */
export type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    }
  : T;

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Soft deletable entity
 */
export interface SoftDeletable {
  deletedAt: Nullable<Timestamp>;
}

/**
 * Entity with audit fields
 */
export interface Auditable {
  createdBy: Nullable<ID>;
  updatedBy: Nullable<ID>;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort configuration
 */
export interface SortConfig<T = string> {
  field: T;
  direction: SortDirection;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

