import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleListUsers } from '../../src/slices/list-users/list-users.handler';
import type { IUserRepository } from '../../src/ports/user.repository.port';
import { createMockUsers } from '../fixtures/user.fixture';
import { UserRole, UserStatus } from '../../src/types';

describe('List Users Integration', () => {
  let mockRepository: IUserRepository;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      emailExists: vi.fn(),
      count: vi.fn(),
    };
  });

  it('should list users with default pagination', async () => {
    const users = createMockUsers(5);
    vi.mocked(mockRepository.findAll).mockResolvedValue({
      items: users,
      total: 5,
    });

    const result = await handleListUsers(mockRepository);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items).toHaveLength(5);
      expect(result.data.total).toBe(5);
      expect(result.data.page).toBe(1);
    }
  });

  it('should list users with custom pagination', async () => {
    const users = createMockUsers(10);
    vi.mocked(mockRepository.findAll).mockResolvedValue({
      items: users.slice(0, 5),
      total: 10,
    });

    const result = await handleListUsers(mockRepository, {
      pagination: { page: 1, pageSize: 5 },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items).toHaveLength(5);
      expect(result.data.total).toBe(10);
      expect(result.data.totalPages).toBe(2);
    }
  });

  it('should list users with filters', async () => {
    const adminUsers = createMockUsers(3).map((u) => ({
      ...u,
      role: UserRole.ADMIN,
    }));

    vi.mocked(mockRepository.findAll).mockResolvedValue({
      items: adminUsers,
      total: 3,
    });

    const result = await handleListUsers(mockRepository, {
      filters: { role: UserRole.ADMIN },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items).toHaveLength(3);
      result.data.items.forEach((user) => {
        expect(user.role).toBe(UserRole.ADMIN);
      });
    }
  });

  it('should return empty list when no users found', async () => {
    vi.mocked(mockRepository.findAll).mockResolvedValue({
      items: [],
      total: 0,
    });

    const result = await handleListUsers(mockRepository, {
      filters: { status: UserStatus.BANNED },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items).toHaveLength(0);
      expect(result.data.total).toBe(0);
    }
  });
});

