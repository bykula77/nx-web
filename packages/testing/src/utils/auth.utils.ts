import { vi } from 'vitest';

/**
 * Mock user data
 */
export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
  avatarUrl?: string;
  emailVerified: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mock session data
 */
export interface MockSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  expiresIn: number;
}

/**
 * Mock auth state
 */
export interface MockAuthState {
  user: MockUser | null;
  session: MockSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

/**
 * Default mock user
 */
const defaultMockUser: MockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  fullName: 'Test User',
  role: 'user',
  permissions: [],
  emailVerified: true,
  metadata: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Default mock session
 */
const defaultMockSession: MockSession = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresAt: new Date(Date.now() + 3600000).toISOString(),
  expiresIn: 3600,
};

/**
 * Create a mock user with optional overrides
 */
export function mockUser(overrides?: Partial<MockUser>): MockUser {
  return {
    ...defaultMockUser,
    ...overrides,
    id: overrides?.id || `test-user-${Date.now()}`,
  };
}

/**
 * Create a mock session with optional overrides
 */
export function mockSession(overrides?: Partial<MockSession>): MockSession {
  return {
    ...defaultMockSession,
    ...overrides,
  };
}

/**
 * Create a mock auth state
 */
export function mockAuthState(options?: {
  user?: Partial<MockUser> | null;
  session?: Partial<MockSession> | null;
  isLoading?: boolean;
  error?: Error | null;
}): MockAuthState {
  const isAuthenticated = options?.user !== null;

  return {
    user: options?.user === null ? null : mockUser(options?.user),
    session: options?.session === null ? null : mockSession(options?.session),
    isLoading: options?.isLoading ?? false,
    isAuthenticated,
    error: options?.error ?? null,
  };
}

/**
 * Create an authenticated mock auth state
 */
export function mockAuthenticatedState(
  userOverrides?: Partial<MockUser>
): MockAuthState {
  return mockAuthState({
    user: userOverrides,
    isLoading: false,
  });
}

/**
 * Create an unauthenticated mock auth state
 */
export function mockUnauthenticatedState(): MockAuthState {
  return {
    user: null,
    session: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
  };
}

/**
 * Create a loading mock auth state
 */
export function mockLoadingState(): MockAuthState {
  return {
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  };
}

/**
 * Mock auth context value with all methods
 */
export function mockAuthContext(state: MockAuthState) {
  return {
    ...state,
    signIn: vi.fn().mockResolvedValue(undefined),
    signUp: vi.fn().mockResolvedValue(undefined),
    signOut: vi.fn().mockResolvedValue(undefined),
    signInWithOAuth: vi.fn().mockResolvedValue(undefined),
    resetPassword: vi.fn().mockResolvedValue(undefined),
    updatePassword: vi.fn().mockResolvedValue(undefined),
    refreshSession: vi.fn().mockResolvedValue(undefined),
    updateProfile: vi.fn().mockResolvedValue(undefined),
  };
}

/**
 * Create a mock Supabase client for testing
 */
export function createAuthenticatedClient(user?: Partial<MockUser>) {
  const mockUserData = mockUser(user);

  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
            user: {
              id: mockUserData.id,
              email: mockUserData.email,
              user_metadata: {
                full_name: mockUserData.fullName,
              },
              app_metadata: {
                role: mockUserData.role,
                permissions: mockUserData.permissions,
              },
            },
          },
        },
        error: null,
      }),
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: mockUserData.id,
            email: mockUserData.email,
            user_metadata: {
              full_name: mockUserData.fullName,
            },
            app_metadata: {
              role: mockUserData.role,
              permissions: mockUserData.permissions,
            },
          },
        },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { session: mockSession(), user: mockUserData },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  };
}

/**
 * Login as a specific user in tests
 */
export async function loginAsUser(
  signIn: (credentials: { email: string; password: string }) => Promise<void>,
  email = 'test@example.com',
  password = 'password123'
): Promise<void> {
  await signIn({ email, password });
}

/**
 * Create mock users with different roles
 */
export const mockUsers = {
  admin: () =>
    mockUser({
      role: 'admin',
      permissions: ['users:view', 'users:create', 'users:update', 'users:delete'],
    }),
  editor: () =>
    mockUser({
      role: 'editor',
      permissions: ['content:view', 'content:create', 'content:update'],
    }),
  viewer: () =>
    mockUser({
      role: 'viewer',
      permissions: ['content:view'],
    }),
  guest: () =>
    mockUser({
      role: 'guest',
      permissions: [],
    }),
};

