import type { ID, PaginationMeta } from './common.types';

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  success: boolean;
}

/**
 * API error response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  statusCode: number;
  timestamp?: string;
  path?: string;
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * API request with pagination
 */
export interface PaginatedRequest {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * API request with search
 */
export interface SearchRequest extends PaginatedRequest {
  search?: string;
  filters?: Record<string, unknown>;
}

/**
 * Mutation response (create/update)
 */
export interface MutationResponse<T> extends ApiResponse<T> {
  id: ID;
}

/**
 * Delete response
 */
export interface DeleteResponse {
  success: boolean;
  message?: string;
  deletedId: ID;
}

/**
 * Batch operation response
 */
export interface BatchResponse<T> {
  success: boolean;
  results: Array<{
    id: ID;
    success: boolean;
    data?: T;
    error?: string;
  }>;
  totalSuccess: number;
  totalFailed: number;
}

/**
 * Upload response
 */
export interface UploadResponse {
  success: boolean;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  services?: Record<
    string,
    {
      status: 'up' | 'down';
      latency?: number;
    }
  >;
}

