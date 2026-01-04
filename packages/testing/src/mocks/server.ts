import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW server for intercepting requests in tests
 */
export const server = setupServer(...handlers);

/**
 * Start the MSW server
 */
export function startServer(): void {
  server.listen({
    onUnhandledRequest: 'warn',
  });
}

/**
 * Reset handlers to default
 */
export function resetHandlers(): void {
  server.resetHandlers();
}

/**
 * Close the MSW server
 */
export function closeServer(): void {
  server.close();
}

