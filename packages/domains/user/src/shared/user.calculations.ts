import type { User } from '../types/user.entity';
import { UserStatus, ROLE_HIERARCHY, UserRole } from '../types';

/**
 * Check if user is active
 */
export function isUserActive(user: User): boolean {
  return user.status === UserStatus.ACTIVE;
}

/**
 * Check if user is banned
 */
export function isUserBanned(user: User): boolean {
  return user.status === UserStatus.BANNED;
}

/**
 * Check if user has admin role
 */
export function isAdmin(user: User): boolean {
  return user.role === UserRole.ADMIN;
}

/**
 * Check if user has specific role or higher
 */
export function hasRoleOrHigher(user: User, requiredRole: UserRole): boolean {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(user.role);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  return userRoleIndex >= requiredRoleIndex;
}

/**
 * Get user display name
 * Returns full name if available, otherwise email prefix
 */
export function getUserDisplayName(user: User): string {
  if (user.fullName && user.fullName.trim()) {
    return user.fullName;
  }
  return user.email.split('@')[0] ?? user.email;
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(user: User): string {
  const name = getUserDisplayName(user);
  const parts = name.split(' ');

  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
}

/**
 * Calculate account age in days
 */
export function getAccountAgeDays(user: User): number {
  const now = new Date();
  const created = new Date(user.createdAt);
  const diffMs = now.getTime() - created.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check if user account is new (less than 7 days)
 */
export function isNewUser(user: User): boolean {
  return getAccountAgeDays(user) < 7;
}

/**
 * Check if user has logged in recently (within last 30 days)
 */
export function hasRecentLogin(user: User): boolean {
  if (!user.lastLoginAt) {
    return false;
  }

  const now = new Date();
  const lastLogin = new Date(user.lastLoginAt);
  const diffMs = now.getTime() - lastLogin.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays < 30;
}

/**
 * Get days since last login
 */
export function getDaysSinceLastLogin(user: User): number | null {
  if (!user.lastLoginAt) {
    return null;
  }

  const now = new Date();
  const lastLogin = new Date(user.lastLoginAt);
  const diffMs = now.getTime() - lastLogin.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

