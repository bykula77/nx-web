/**
 * R2 client configuration
 */
export interface R2ClientConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket?: string;
}

/**
 * R2 object metadata
 */
export interface R2Object {
  key: string;
  bucket: string;
  size: number;
  contentType?: string;
  lastModified: Date;
  etag: string;
  metadata?: Record<string, string>;
}

/**
 * R2 upload options
 */
export interface R2UploadOptions {
  contentType?: string;
  contentDisposition?: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
  contentEncoding?: string;
  contentLanguage?: string;
}

/**
 * R2 list options
 */
export interface R2ListOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
  delimiter?: string;
  startAfter?: string;
}

/**
 * Presigned URL options
 */
export interface PresignedUrlOptions {
  expiresIn?: number;
  contentType?: string;
  contentDisposition?: string;
  metadata?: Record<string, string>;
}

/**
 * Presigned URL result
 */
export interface PresignedUrlResult {
  url: string;
  key: string;
  bucket: string;
  expiresAt: string;
  method: 'GET' | 'PUT';
}

/**
 * Multipart upload options
 */
export interface MultipartUploadOptions {
  partSize?: number;
  contentType?: string;
  metadata?: Record<string, string>;
}

/**
 * Multipart upload part
 */
export interface MultipartUploadPart {
  partNumber: number;
  etag: string;
  size: number;
}

/**
 * Multipart upload result
 */
export interface MultipartUploadResult {
  uploadId: string;
  key: string;
  bucket: string;
  parts: MultipartUploadPart[];
}

