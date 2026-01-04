import { http, HttpResponse } from 'msw';
import { createMockUser, createMockUsers } from '../fixtures/user.fixture';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
const USERS_ENDPOINT = `${SUPABASE_URL}/rest/v1/users`;

/**
 * MSW handlers for user endpoints
 */
export const userHandlers = [
  // List users
  http.get(USERS_ENDPOINT, () => {
    const users = createMockUsers(10);
    return HttpResponse.json(users, {
      headers: {
        'Content-Range': '0-9/10',
      },
    });
  }),

  // Get user by ID
  http.get(`${USERS_ENDPOINT}/:id`, ({ params }) => {
    const user = createMockUser({ id: params.id as string });
    return HttpResponse.json(user);
  }),

  // Create user
  http.post(USERS_ENDPOINT, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const user = createMockUser({
      email: body.email as string,
      fullName: body.full_name as string,
    });
    return HttpResponse.json(user, { status: 201 });
  }),

  // Update user
  http.patch(`${USERS_ENDPOINT}/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    const user = createMockUser({
      id: params.id as string,
      ...body,
    });
    return HttpResponse.json(user);
  }),

  // Delete user
  http.delete(`${USERS_ENDPOINT}/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];

