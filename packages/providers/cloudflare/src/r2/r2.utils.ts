import { randomBytes } from 'crypto';

/**
 * Generate a unique file key with optional prefix
 */
export function generateFileKey(
  filename: string,
  options?: {
    prefix?: string;
    preserveOriginalName?: boolean;
    includeTimestamp?: boolean;
  }
): string {
  const { prefix = '', preserveOriginalName = false, includeTimestamp = true } = options || {};

  const ext = getFileExtension(filename);
  const timestamp = includeTimestamp ? Date.now() : '';
  const randomId = randomBytes(8).toString('hex');

  let key = '';

  if (prefix) {
    key += `${prefix}/`;
  }

  if (preserveOriginalName) {
    const baseName = filename.replace(/\.[^/.]+$/, '');
    const sanitizedName = sanitizeFilename(baseName);
    key += `${sanitizedName}-${randomId}`;
  } else {
    key += timestamp ? `${timestamp}-${randomId}` : randomId;
  }

  if (ext) {
    key += `.${ext}`;
  }

  return key;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot + 1).toLowerCase();
}

/**
 * Sanitize filename for use in URLs
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

/**
 * Get bucket path with optional subdirectories
 */
export function getBucketPath(...segments: string[]): string {
  return segments
    .filter(Boolean)
    .map((s) => s.replace(/^\/+|\/+$/g, ''))
    .join('/');
}

/**
 * Parse R2 URL to extract bucket and key
 */
export function parseR2Url(url: string): { bucket: string; key: string } | null {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);

    if (pathParts.length < 2) {
      return null;
    }

    const bucket = pathParts[0];
    const key = pathParts.slice(1).join('/');

    return { bucket, key };
  } catch {
    return null;
  }
}

/**
 * Build R2 public URL
 */
export function buildR2Url(
  accountId: string,
  bucket: string,
  key: string,
  customDomain?: string
): string {
  if (customDomain) {
    return `https://${customDomain}/${key}`;
  }

  return `https://${bucket}.${accountId}.r2.cloudflarestorage.com/${key}`;
}

/**
 * Get content type from file extension
 */
export function getContentTypeFromExtension(filename: string): string {
  const ext = getFileExtension(filename);

  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',

    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

    // Video
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',

    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',

    // Archives
    zip: 'application/zip',
    tar: 'application/x-tar',
    gz: 'application/gzip',

    // Text
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    xml: 'application/xml',
  };

  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Calculate file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validate file size against limit
 */
export function validateFileSize(bytes: number, maxSizeMB: number): boolean {
  return bytes <= maxSizeMB * 1024 * 1024;
}

/**
 * Validate file type against allowed types
 */
export function validateFileType(filename: string, allowedTypes: string[]): boolean {
  const ext = getFileExtension(filename);
  return allowedTypes.includes(ext);
}

