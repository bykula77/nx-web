import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../mocks/server';
import type { RequestHandler } from 'msw';

/**
 * Setup MSW server for tests
 * Call this in your test setup file
 */
export function setupMSW(customHandlers?: RequestHandler[]): void {
  // Start server before all tests
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'warn',
    });

    // Add custom handlers if provided
    if (customHandlers && customHandlers.length > 0) {
      server.use(...customHandlers);
    }
  });

  // Reset handlers after each test
  afterEach(() => {
    server.resetHandlers();
  });

  // Close server after all tests
  afterAll(() => {
    server.close();
  });
}

/**
 * Reset MSW handlers to initial state
 */
export function resetMSWHandlers(): void {
  server.resetHandlers();
}

/**
 * Add temporary handlers for a specific test
 */
export function useMSWHandlers(...handlers: RequestHandler[]): void {
  server.use(...handlers);
}

/**
 * Wait for a specific request to be made
 */
export function waitForRequest(
  method: string,
  url: string | RegExp,
  timeout = 5000
): Promise<Request> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timed out waiting for ${method} ${url}`));
    }, timeout);

    server.events.on('request:start', ({ request }) => {
      const matchesMethod = request.method === method;
      const matchesUrl =
        url instanceof RegExp
          ? url.test(request.url)
          : request.url.includes(url);

      if (matchesMethod && matchesUrl) {
        clearTimeout(timeoutId);
        resolve(request);
      }
    });
  });
}

/**
 * Create a mock response helper
 */
export function createMockResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create a mock error response
 */
export function createMockErrorResponse(
  message: string,
  status = 400
): Response {
  return new Response(
    JSON.stringify({
      error: message,
      message,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

