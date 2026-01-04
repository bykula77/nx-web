/**
 * Formats a date to a string representation
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'long' | 'iso' = 'short'
): string {
  const d = new Date(date);

  if (!isValidDate(d)) {
    return '';
  }

  switch (format) {
    case 'iso':
      return d.toISOString();
    case 'long':
      return d.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'short':
    default:
      return d.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
  }
}

/**
 * Parses a date string to a Date object
 */
export function parseDate(dateString: string): Date | null {
  const parsed = new Date(dateString);
  return isValidDate(parsed) ? parsed : null;
}

/**
 * Checks if a value is a valid date
 */
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Gets relative time string (e.g., "5 minutes ago", "in 2 hours")
 */
export function getRelativeTime(date: Date | string | number): string {
  const d = new Date(date);

  if (!isValidDate(d)) {
    return '';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  const isFuture = diffInSeconds < 0;
  const abs = Math.abs;

  if (abs(diffInSeconds) < 60) {
    return isFuture ? 'biraz sonra' : 'az önce';
  }
  if (abs(diffInMinutes) < 60) {
    const mins = abs(diffInMinutes);
    return isFuture ? `${mins} dakika sonra` : `${mins} dakika önce`;
  }
  if (abs(diffInHours) < 24) {
    const hours = abs(diffInHours);
    return isFuture ? `${hours} saat sonra` : `${hours} saat önce`;
  }
  if (abs(diffInDays) < 7) {
    const days = abs(diffInDays);
    return isFuture ? `${days} gün sonra` : `${days} gün önce`;
  }
  if (abs(diffInWeeks) < 4) {
    const weeks = abs(diffInWeeks);
    return isFuture ? `${weeks} hafta sonra` : `${weeks} hafta önce`;
  }
  if (abs(diffInMonths) < 12) {
    const months = abs(diffInMonths);
    return isFuture ? `${months} ay sonra` : `${months} ay önce`;
  }

  const years = abs(diffInYears);
  return isFuture ? `${years} yıl sonra` : `${years} yıl önce`;
}

/**
 * Gets the start of a day
 */
export function startOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Gets the end of a day
 */
export function endOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Adds days to a date
 */
export function addDays(date: Date | string | number, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Checks if two dates are the same day
 */
export function isSameDay(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

