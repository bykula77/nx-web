import { http, HttpResponse } from 'msw';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';

/**
 * Mock file object
 */
interface MockFile {
  name: string;
  id: string;
  bucket_id: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
}

/**
 * In-memory storage for mock files
 */
const mockStorage: Map<string, MockFile[]> = new Map();

/**
 * Storage MSW handlers
 */
export const storageHandlers = [
  // List buckets
  http.get(`${SUPABASE_URL}/storage/v1/bucket`, () => {
    return HttpResponse.json([
      { id: 'avatars', name: 'avatars', public: true },
      { id: 'documents', name: 'documents', public: false },
      { id: 'assets', name: 'assets', public: true },
    ]);
  }),

  // Get bucket
  http.get(`${SUPABASE_URL}/storage/v1/bucket/:bucketId`, ({ params }) => {
    const { bucketId } = params;
    return HttpResponse.json({
      id: bucketId,
      name: bucketId,
      public: true,
    });
  }),

  // Upload file
  http.post(`${SUPABASE_URL}/storage/v1/object/:bucket/*`, async ({ params, request }) => {
    const bucket = params.bucket as string;
    const path = (params['0'] as string) || 'unknown';

    // Get content type from request
    const contentType = request.headers.get('content-type') || 'application/octet-stream';

    const file: MockFile = {
      name: path,
      id: `${bucket}/${path}`,
      bucket_id: bucket,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: { contentType },
    };

    // Store in mock storage
    const files = mockStorage.get(bucket) || [];
    files.push(file);
    mockStorage.set(bucket, files);

    return HttpResponse.json({
      Key: `${bucket}/${path}`,
      Id: file.id,
    });
  }),

  // Download file
  http.get(`${SUPABASE_URL}/storage/v1/object/:bucket/*`, ({ params }) => {
    const bucket = params.bucket as string;
    const path = params['0'] as string;

    const files = mockStorage.get(bucket) || [];
    const file = files.find((f) => f.name === path);

    if (!file) {
      return HttpResponse.json(
        { error: 'not_found', message: 'Object not found' },
        { status: 404 }
      );
    }

    // Return mock file content
    return new HttpResponse(new Uint8Array([0, 1, 2, 3]), {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
  }),

  // Delete file
  http.delete(`${SUPABASE_URL}/storage/v1/object/:bucket/*`, ({ params }) => {
    const bucket = params.bucket as string;
    const path = params['0'] as string;

    const files = mockStorage.get(bucket) || [];
    const index = files.findIndex((f) => f.name === path);

    if (index !== -1) {
      files.splice(index, 1);
      mockStorage.set(bucket, files);
    }

    return HttpResponse.json({ message: 'Deleted' });
  }),

  // List files
  http.post(`${SUPABASE_URL}/storage/v1/object/list/:bucket`, ({ params }) => {
    const bucket = params.bucket as string;
    const files = mockStorage.get(bucket) || [];

    return HttpResponse.json(
      files.map((f) => ({
        name: f.name,
        id: f.id,
        created_at: f.created_at,
        updated_at: f.updated_at,
        metadata: f.metadata,
      }))
    );
  }),

  // Get public URL
  http.get(
    `${SUPABASE_URL}/storage/v1/object/public/:bucket/*`,
    ({ params }) => {
      const bucket = params.bucket as string;
      const path = params['0'] as string;

      // Return mock file content
      return new HttpResponse(new Uint8Array([0, 1, 2, 3]), {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
    }
  ),

  // Create signed URL
  http.post(
    `${SUPABASE_URL}/storage/v1/object/sign/:bucket/*`,
    ({ params }) => {
      const bucket = params.bucket as string;
      const path = params['0'] as string;

      return HttpResponse.json({
        signedUrl: `${SUPABASE_URL}/storage/v1/object/sign/${bucket}/${path}?token=mock-token`,
      });
    }
  ),
];

/**
 * Reset mock storage
 */
export function resetMockStorage(): void {
  mockStorage.clear();
}

/**
 * Add mock files to storage
 */
export function addMockFiles(bucket: string, files: Partial<MockFile>[]): void {
  const existingFiles = mockStorage.get(bucket) || [];

  const newFiles = files.map((f, index) => ({
    name: f.name || `file-${index}`,
    id: f.id || `${bucket}/${f.name || `file-${index}`}`,
    bucket_id: bucket,
    created_at: f.created_at || new Date().toISOString(),
    updated_at: f.updated_at || new Date().toISOString(),
    metadata: f.metadata || {},
  }));

  mockStorage.set(bucket, [...existingFiles, ...newFiles]);
}

/**
 * Get mock files from storage
 */
export function getMockFiles(bucket: string): MockFile[] {
  return mockStorage.get(bucket) || [];
}

