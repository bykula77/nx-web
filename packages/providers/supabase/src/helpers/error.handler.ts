import type { PostgrestError, AuthError, StorageError } from '@supabase/supabase-js';

/**
 * Normalized application error
 */
export interface AppError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
  originalError?: unknown;
}

/**
 * Create an AppError
 */
function createAppError(
  message: string,
  code: string,
  statusCode: number,
  originalError?: unknown
): AppError {
  const error = new Error(message) as AppError;
  error.code = code;
  error.statusCode = statusCode;
  error.originalError = originalError;
  return error;
}

/**
 * Supabase error type guard
 */
export function isSupabaseError(
  error: unknown
): error is PostgrestError | AuthError | StorageError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'message' in error
  );
}

/**
 * Map Supabase error codes to status codes
 */
const ERROR_CODE_MAP: Record<string, number> = {
  // Auth errors
  invalid_credentials: 401,
  user_not_found: 404,
  email_not_confirmed: 403,
  user_already_exists: 409,
  weak_password: 400,
  invalid_email: 400,

  // Database errors
  '23505': 409, // unique_violation
  '23503': 400, // foreign_key_violation
  '23502': 400, // not_null_violation
  '42501': 403, // insufficient_privilege
  '42P01': 404, // undefined_table
  PGRST116: 404, // Not found (single row expected)
  PGRST301: 400, // Invalid request

  // Storage errors
  'object-not-found': 404,
  'bucket-not-found': 404,
  'payload-too-large': 413,
};

/**
 * Friendly error messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'E-posta veya şifre hatalı',
  user_not_found: 'Kullanıcı bulunamadı',
  email_not_confirmed: 'E-posta adresi doğrulanmamış',
  user_already_exists: 'Bu e-posta adresi zaten kullanılıyor',
  weak_password: 'Şifre çok zayıf',
  invalid_email: 'Geçersiz e-posta adresi',
  '23505': 'Bu kayıt zaten mevcut',
  '23503': 'İlişkili kayıt bulunamadı',
  '23502': 'Zorunlu alan boş bırakılamaz',
  '42501': 'Bu işlem için yetkiniz yok',
  PGRST116: 'Kayıt bulunamadı',
  'object-not-found': 'Dosya bulunamadı',
  'bucket-not-found': 'Depolama alanı bulunamadı',
  'payload-too-large': 'Dosya boyutu çok büyük',
};

/**
 * Convert Supabase error to normalized AppError
 */
export function toAppError(error: unknown): AppError {
  if (!isSupabaseError(error)) {
    if (error instanceof Error) {
      return createAppError(error.message, 'UNKNOWN_ERROR', 500, error);
    }
    return createAppError('Beklenmeyen bir hata oluştu', 'UNKNOWN_ERROR', 500, error);
  }

  const code = 'code' in error ? String(error.code) : 'UNKNOWN_ERROR';
  const statusCode = ERROR_CODE_MAP[code] || 500;
  const message = ERROR_MESSAGES[code] || error.message;

  return createAppError(message, code, statusCode, error);
}

/**
 * Check if error is a specific type
 */
export function isNotFoundError(error: unknown): boolean {
  if (error instanceof Error && 'statusCode' in error) {
    return (error as AppError).statusCode === 404;
  }
  return false;
}

export function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof Error && 'statusCode' in error) {
    return (error as AppError).statusCode === 401;
  }
  return false;
}

export function isForbiddenError(error: unknown): boolean {
  if (error instanceof Error && 'statusCode' in error) {
    return (error as AppError).statusCode === 403;
  }
  return false;
}

export function isConflictError(error: unknown): boolean {
  if (error instanceof Error && 'statusCode' in error) {
    return (error as AppError).statusCode === 409;
  }
  return false;
}

