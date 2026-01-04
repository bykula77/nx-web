import { authHandlers } from './auth.handlers';
import { storageHandlers } from './storage.handlers';

/**
 * All MSW handlers
 */
export const handlers = [...authHandlers, ...storageHandlers];

export { authHandlers } from './auth.handlers';
export { storageHandlers } from './storage.handlers';

