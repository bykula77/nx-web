/**
 * Pagination options
 */
export interface PaginationOptions {
  /**
   * Current page (1-based)
   */
  page: number;

  /**
   * Items per page
   */
  pageSize: number;
}

/**
 * Range result for Supabase query
 */
export interface RangeResult {
  from: number;
  to: number;
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

/**
 * Calculate Supabase range from pagination options
 * Supabase uses 0-based, inclusive range
 */
export function calculateRange(options: PaginationOptions): RangeResult {
  const { page, pageSize } = options;

  // Convert 1-based page to 0-based offset
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return { from, to };
}

/**
 * Calculate pagination metadata from total count
 */
export function calculatePaginationMeta(
  options: PaginationOptions,
  totalItems: number
): PaginationMeta {
  const { page, pageSize } = options;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Cursor-based pagination options
 */
export interface CursorPaginationOptions {
  /**
   * Cursor value (usually the ID of the last item)
   */
  cursor?: string;

  /**
   * Number of items to fetch
   */
  limit: number;

  /**
   * Direction to paginate
   */
  direction?: 'forward' | 'backward';
}

/**
 * Build cursor pagination filter
 */
export function buildCursorFilter(
  column: string,
  options: CursorPaginationOptions
): { operator: 'gt' | 'lt'; value: string } | null {
  const { cursor, direction = 'forward' } = options;

  if (!cursor) {
    return null;
  }

  return {
    operator: direction === 'forward' ? 'gt' : 'lt',
    value: cursor,
  };
}

