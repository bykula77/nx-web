import type { User } from '../types/user.entity';
import type { CreateUserDTO, UpdateUserDTO, UserFilterDTO, UserPaginationDTO } from '../types/user.dto';

/**
 * User repository interface
 * Defines the contract for user data access
 */
export interface IUserRepository {
  /**
   * Find a user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find all users with optional filtering and pagination
   */
  findAll(
    filter?: UserFilterDTO,
    pagination?: UserPaginationDTO
  ): Promise<{ items: User[]; total: number }>;

  /**
   * Create a new user
   */
  create(data: CreateUserDTO): Promise<User>;

  /**
   * Update an existing user
   */
  update(id: string, data: UpdateUserDTO): Promise<User>;

  /**
   * Delete a user by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if email exists
   */
  emailExists(email: string, excludeId?: string): Promise<boolean>;

  /**
   * Count users with optional filter
   */
  count(filter?: UserFilterDTO): Promise<number>;
}

