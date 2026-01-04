import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Client } from './r2.client';
import type { PresignedUrlOptions, PresignedUrlResult } from '../types';

/**
 * Default expiration time for presigned URLs (1 hour)
 */
const DEFAULT_EXPIRATION = 3600;

/**
 * Generate a presigned URL for uploading a file
 */
export async function generatePresignedUploadUrl(
  bucket: string,
  key: string,
  options?: PresignedUrlOptions
): Promise<PresignedUrlResult> {
  const client = getR2Client();
  const expiresIn = options?.expiresIn || DEFAULT_EXPIRATION;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: options?.contentType,
    ContentDisposition: options?.contentDisposition,
    Metadata: options?.metadata,
  });

  const url = await getSignedUrl(client, command, { expiresIn });

  return {
    url,
    key,
    bucket,
    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    method: 'PUT',
  };
}

/**
 * Generate a presigned URL for downloading a file
 */
export async function generatePresignedDownloadUrl(
  bucket: string,
  key: string,
  options?: PresignedUrlOptions
): Promise<PresignedUrlResult> {
  const client = getR2Client();
  const expiresIn = options?.expiresIn || DEFAULT_EXPIRATION;

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: options?.contentDisposition,
    ResponseContentType: options?.contentType,
  });

  const url = await getSignedUrl(client, command, { expiresIn });

  return {
    url,
    key,
    bucket,
    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    method: 'GET',
  };
}

/**
 * Generate presigned URLs for multiple files
 */
export async function generatePresignedUrls(
  bucket: string,
  keys: string[],
  type: 'upload' | 'download',
  options?: PresignedUrlOptions
): Promise<PresignedUrlResult[]> {
  const generator =
    type === 'upload' ? generatePresignedUploadUrl : generatePresignedDownloadUrl;

  return Promise.all(keys.map((key) => generator(bucket, key, options)));
}

/**
 * Generate a presigned URL for multipart upload initiation
 * Note: R2 supports multipart uploads via the S3-compatible API
 */
export async function generateMultipartUploadUrl(
  bucket: string,
  key: string,
  options?: PresignedUrlOptions & { partNumber?: number; uploadId?: string }
): Promise<PresignedUrlResult> {
  const client = getR2Client();
  const expiresIn = options?.expiresIn || DEFAULT_EXPIRATION;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: options?.contentType,
  });

  const url = await getSignedUrl(client, command, { expiresIn });

  return {
    url,
    key,
    bucket,
    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    method: 'PUT',
  };
}

