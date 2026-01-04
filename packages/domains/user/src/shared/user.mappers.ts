import type { User } from '../types/user.entity';
import type { UserResponseDTO, UserListItemDTO } from '../types/user.dto';

/**
 * Map database row to User entity
 */
export function toUserEntity(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    fullName: (row.full_name || row.fullName) as string,
    role: row.role as User['role'],
    status: row.status as User['status'],
    avatarUrl: (row.avatar_url || row.avatarUrl) as string | undefined,
    phone: row.phone as string | undefined,
    metadata: row.metadata as Record<string, unknown> | undefined,
    createdAt: new Date((row.created_at || row.createdAt) as string),
    updatedAt: new Date((row.updated_at || row.updatedAt) as string),
    lastLoginAt: row.last_login_at || row.lastLoginAt
      ? new Date((row.last_login_at || row.lastLoginAt) as string)
      : undefined,
  };
}

/**
 * Map User entity to UserResponseDTO
 */
export function toUserDTO(user: User): UserResponseDTO {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString(),
  };
}

/**
 * Map User entity to UserListItemDTO
 */
export function toUserListItem(user: User): UserListItemDTO {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Map array of Users to array of UserListItemDTO
 */
export function toUserListItems(users: User[]): UserListItemDTO[] {
  return users.map(toUserListItem);
}

/**
 * Map User entity to database row
 */
export function toUserRow(user: Partial<User>): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (user.email !== undefined) row.email = user.email;
  if (user.fullName !== undefined) row.full_name = user.fullName;
  if (user.role !== undefined) row.role = user.role;
  if (user.status !== undefined) row.status = user.status;
  if (user.avatarUrl !== undefined) row.avatar_url = user.avatarUrl;
  if (user.phone !== undefined) row.phone = user.phone;
  if (user.metadata !== undefined) row.metadata = user.metadata;
  if (user.lastLoginAt !== undefined) row.last_login_at = user.lastLoginAt?.toISOString();

  return row;
}

