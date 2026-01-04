import { http, HttpResponse } from 'msw';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';

/**
 * Mock user for auth responses
 */
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
  },
  app_metadata: {
    role: 'user',
    permissions: [],
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Mock session for auth responses
 */
const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: mockUser,
};

/**
 * Auth MSW handlers
 */
export const authHandlers = [
  // Sign in with password
  http.post(`${SUPABASE_URL}/auth/v1/token`, async ({ request }) => {
    const body = await request.json() as { email?: string; password?: string; grant_type?: string };

    if (body.grant_type === 'password') {
      // Simulate invalid credentials
      if (body.email === 'invalid@example.com') {
        return HttpResponse.json(
          { error: 'invalid_credentials', message: 'Invalid login credentials' },
          { status: 400 }
        );
      }

      return HttpResponse.json({
        ...mockSession,
        user: { ...mockUser, email: body.email },
      });
    }

    // Refresh token
    if (body.grant_type === 'refresh_token') {
      return HttpResponse.json(mockSession);
    }

    return HttpResponse.json(mockSession);
  }),

  // Sign up
  http.post(`${SUPABASE_URL}/auth/v1/signup`, async ({ request }) => {
    const body = await request.json() as { email?: string };

    // Simulate existing user
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        { error: 'user_already_exists', message: 'User already registered' },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      ...mockSession,
      user: { ...mockUser, email: body.email },
    });
  }),

  // Sign out
  http.post(`${SUPABASE_URL}/auth/v1/logout`, () => {
    return HttpResponse.json({});
  }),

  // Get session
  http.get(`${SUPABASE_URL}/auth/v1/session`, () => {
    return HttpResponse.json({ session: mockSession });
  }),

  // Get user
  http.get(`${SUPABASE_URL}/auth/v1/user`, () => {
    return HttpResponse.json({ user: mockUser });
  }),

  // Update user
  http.put(`${SUPABASE_URL}/auth/v1/user`, async ({ request }) => {
    const body = await request.json() as { data?: Record<string, unknown> };
    return HttpResponse.json({
      user: {
        ...mockUser,
        user_metadata: { ...mockUser.user_metadata, ...body.data },
      },
    });
  }),

  // Reset password
  http.post(`${SUPABASE_URL}/auth/v1/recover`, () => {
    return HttpResponse.json({});
  }),

  // Verify OTP
  http.post(`${SUPABASE_URL}/auth/v1/verify`, () => {
    return HttpResponse.json(mockSession);
  }),

  // OAuth callback
  http.get(`${SUPABASE_URL}/auth/v1/callback`, () => {
    return HttpResponse.json(mockSession);
  }),
];

/**
 * Create custom auth handlers with specific responses
 */
export function createAuthHandlers(options?: {
  user?: typeof mockUser;
  session?: typeof mockSession;
  signInError?: { error: string; message: string };
}) {
  const user = options?.user || mockUser;
  const session = options?.session || { ...mockSession, user };

  return [
    http.post(`${SUPABASE_URL}/auth/v1/token`, () => {
      if (options?.signInError) {
        return HttpResponse.json(options.signInError, { status: 400 });
      }
      return HttpResponse.json(session);
    }),

    http.get(`${SUPABASE_URL}/auth/v1/user`, () => {
      return HttpResponse.json({ user });
    }),
  ];
}

