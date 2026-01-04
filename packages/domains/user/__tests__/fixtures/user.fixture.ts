import type { User } from '../../src/types/user.entity';
import { UserRole, UserStatus } from '../../src/types';

let userIdCounter = 1;

/**
 * Create a mock user
 */
export function createMockUser(overrides: Partial<User> = {}): User {
  const id = `user-${userIdCounter++}`;
  const now = new Date();

  return {
    id,
    email: `user${userIdCounter}@example.com`,
    fullName: `Test User ${userIdCounter}`,
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create multiple mock users
 */
export function createMockUsers(count: number, overrides: Partial<User> = {}): User[] {
  return Array.from({ length: count }, () => createMockUser(overrides));
}

/**
 * Create a mock admin user
 */
export function createMockAdmin(overrides: Partial<User> = {}): User {
  return createMockUser({
    role: UserRole.ADMIN,
    ...overrides,
  });
}

/**
 * Create a mock editor user
 */
export function createMockEditor(overrides: Partial<User> = {}): User {
  return createMockUser({
    role: UserRole.EDITOR,
    ...overrides,
  });
}

/**
 * Create a mock banned user
 */
export function createMockBannedUser(overrides: Partial<User> = {}): User {
  return createMockUser({
    status: UserStatus.BANNED,
    ...overrides,
  });
}

/**
 * Reset user counter (for tests)
 */
export function resetUserCounter(): void {
  userIdCounter = 1;
}

