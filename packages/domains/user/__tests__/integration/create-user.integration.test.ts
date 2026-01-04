import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleCreateUser } from '../../src/slices/create-user/create-user.handler';
import type { IUserRepository } from '../../src/ports/user.repository.port';
import type { CreateUserCommand } from '../../src/slices/create-user/create-user.command';
import { createMockUser } from '../fixtures/user.fixture';

describe('Create User Integration', () => {
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

  it('should create a user successfully', async () => {
    const command: CreateUserCommand = {
      email: 'test@example.com',
      password: 'Password123',
      fullName: 'Test User',
    };

    const createdUser = createMockUser({
      email: command.email,
      fullName: command.fullName,
    });

    vi.mocked(mockRepository.emailExists).mockResolvedValue(false);
    vi.mocked(mockRepository.create).mockResolvedValue(createdUser);

    const result = await handleCreateUser(mockRepository, command);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe(command.email);
      expect(result.data.fullName).toBe(command.fullName);
    }
  });

  it('should fail if email already exists', async () => {
    const command: CreateUserCommand = {
      email: 'existing@example.com',
      password: 'Password123',
      fullName: 'Test User',
    };

    vi.mocked(mockRepository.emailExists).mockResolvedValue(true);

    const result = await handleCreateUser(mockRepository, command);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('EMAIL_EXISTS');
    }
  });

  it('should fail if password is too short', async () => {
    const command: CreateUserCommand = {
      email: 'test@example.com',
      password: 'short',
      fullName: 'Test User',
    };

    const result = await handleCreateUser(mockRepository, command);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe('VALIDATION_ERROR');
    }
  });

  it('should fail if password has no uppercase', async () => {
    const command: CreateUserCommand = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    };

    const result = await handleCreateUser(mockRepository, command);

    expect(result.success).toBe(false);
  });
});

