import type {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
  UserListDTO,
  UserFilterDTO,
  UserPaginationDTO,
} from '../types/user.dto';

/**
 * Result type for service operations
 */
export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/**
 * User service interface
 * Defines the contract for user business operations
 */
export interface IUserService {
  /**
   * Get a single user by ID
   */
  getUser(id: string): Promise<ServiceResult<UserResponseDTO>>;

  /**
   * Get a user by email
   */
  getUserByEmail(email: string): Promise<ServiceResult<UserResponseDTO>>;

  /**
   * List users with filtering and pagination
   */
  listUsers(
    filter?: UserFilterDTO,
    pagination?: UserPaginationDTO
  ): Promise<ServiceResult<UserListDTO>>;

  /**
   * Create a new user
   */
  createUser(data: CreateUserDTO): Promise<ServiceResult<UserResponseDTO>>;

  /**
   * Update an existing user
   */
  updateUser(id: string, data: UpdateUserDTO): Promise<ServiceResult<UserResponseDTO>>;

  /**
   * Delete a user
   */
  deleteUser(id: string, actorId: string): Promise<ServiceResult<void>>;

  /**
   * Check if email is available
   */
  isEmailAvailable(email: string, excludeId?: string): Promise<boolean>;
}

