import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import type { R2ClientConfig, R2Object, R2ListOptions, R2UploadOptions } from '../types';

let r2Client: S3Client | null = null;

/**
 * Create R2 client with S3-compatible API
 */
export function createR2Client(config: R2ClientConfig): S3Client {
  const { accountId, accessKeyId, secretAccessKey, bucket } = config;

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Get or create R2 client (singleton)
 */
export function getR2Client(): S3Client {
  if (r2Client) {
    return r2Client;
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing Cloudflare R2 environment variables: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY'
    );
  }

  r2Client = createR2Client({
    accountId,
    accessKeyId,
    secretAccessKey,
  });

  return r2Client;
}

/**
 * Upload a file to R2
 */
export async function uploadFile(
  bucket: string,
  key: string,
  body: Buffer | Uint8Array | string | ReadableStream,
  options?: R2UploadOptions
): Promise<R2Object> {
  const client = getR2Client();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: options?.contentType,
    ContentDisposition: options?.contentDisposition,
    CacheControl: options?.cacheControl,
    Metadata: options?.metadata,
  });

  await client.send(command);

  return {
    key,
    bucket,
    size: typeof body === 'string' ? body.length : (body as Buffer).length,
    contentType: options?.contentType,
    lastModified: new Date(),
    etag: '',
  };
}

/**
 * Download a file from R2
 */
export async function downloadFile(
  bucket: string,
  key: string
): Promise<{ body: ReadableStream | null; metadata: R2Object }> {
  const client = getR2Client();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await client.send(command);

  return {
    body: response.Body as ReadableStream | null,
    metadata: {
      key,
      bucket,
      size: response.ContentLength || 0,
      contentType: response.ContentType,
      lastModified: response.LastModified || new Date(),
      etag: response.ETag || '',
    },
  };
}

/**
 * Delete a file from R2
 */
export async function deleteFile(bucket: string, key: string): Promise<void> {
  const client = getR2Client();

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(command);
}

/**
 * Delete multiple files from R2
 */
export async function deleteFiles(bucket: string, keys: string[]): Promise<void> {
  await Promise.all(keys.map((key) => deleteFile(bucket, key)));
}

/**
 * List files in R2 bucket
 */
export async function listFiles(
  bucket: string,
  options?: R2ListOptions
): Promise<{ objects: R2Object[]; continuationToken?: string }> {
  const client = getR2Client();

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: options?.prefix,
    MaxKeys: options?.limit,
    ContinuationToken: options?.cursor,
    Delimiter: options?.delimiter,
  });

  const response = await client.send(command);

  const objects: R2Object[] =
    response.Contents?.map((item) => ({
      key: item.Key || '',
      bucket,
      size: item.Size || 0,
      lastModified: item.LastModified || new Date(),
      etag: item.ETag || '',
    })) || [];

  return {
    objects,
    continuationToken: response.NextContinuationToken,
  };
}

/**
 * Check if a file exists in R2
 */
export async function fileExists(bucket: string, key: string): Promise<boolean> {
  const client = getR2Client();

  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await client.send(command);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy a file within R2
 */
export async function copyFile(
  sourceBucket: string,
  sourceKey: string,
  destinationBucket: string,
  destinationKey: string
): Promise<void> {
  const client = getR2Client();

  const command = new CopyObjectCommand({
    Bucket: destinationBucket,
    Key: destinationKey,
    CopySource: `${sourceBucket}/${sourceKey}`,
  });

  await client.send(command);
}

/**
 * Get file metadata from R2
 */
export async function getFileMetadata(bucket: string, key: string): Promise<R2Object | null> {
  const client = getR2Client();

  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const response = await client.send(command);

    return {
      key,
      bucket,
      size: response.ContentLength || 0,
      contentType: response.ContentType,
      lastModified: response.LastModified || new Date(),
      etag: response.ETag || '',
      metadata: response.Metadata,
    };
  } catch {
    return null;
  }
}

