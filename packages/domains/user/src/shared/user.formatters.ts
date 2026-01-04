import type { User } from '../types/user.entity';
import { UserRole, UserStatus, USER_ROLE_LABELS, USER_STATUS_LABELS, USER_STATUS_COLORS } from '../types';

/**
 * Format user's full name
 * Capitalizes first letter of each word
 */
export function formatUserName(name: string): string {
  return name
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format user role for display
 */
export function formatUserRole(role: UserRole): string {
  return USER_ROLE_LABELS[role] || role;
}

/**
 * Format user status for display
 */
export function formatUserStatus(status: UserStatus): string {
  return USER_STATUS_LABELS[status] || status;
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: UserStatus): string {
  return USER_STATUS_COLORS[status] || 'default';
}

/**
 * Format email (lowercase)
 */
export function formatEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string | undefined): string {
  if (!phone) return '';

  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Format Turkish phone numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
  }

  if (digits.length === 11 && digits.startsWith('0')) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }

  return phone;
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 gün önce")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'Az önce';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} dakika önce`;
  }

  if (diffHours < 24) {
    return `${diffHours} saat önce`;
  }

  if (diffDays < 7) {
    return `${diffDays} gün önce`;
  }

  return formatDate(d);
}

/**
 * Format user for display (name + email)
 */
export function formatUserDisplay(user: User): string {
  return `${user.fullName} (${user.email})`;
}

