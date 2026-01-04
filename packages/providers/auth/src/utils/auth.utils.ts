/**
 * JWT token payload structure
 */
export interface TokenPayload {
  sub: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
  aud?: string;
  iss?: string;
  [key: string]: unknown;
}

/**
 * Parse a JWT token without verification
 * Note: This only decodes, it does NOT verify the signature
 */
export function parseJwt(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Get the payload from a JWT token
 */
export function getTokenPayload(token: string): TokenPayload | null {
  return parseJwt(token);
}

/**
 * Check if a token is expired
 * @param expiresAt - ISO date string or expiration timestamp
 */
export function isTokenExpired(expiresAt: string | number): boolean {
  const expirationTime =
    typeof expiresAt === 'string'
      ? new Date(expiresAt).getTime()
      : expiresAt * 1000; // Convert seconds to milliseconds if timestamp

  // Add a 10 second buffer to account for clock skew
  return Date.now() >= expirationTime - 10000;
}

/**
 * Get the expiration date from a token
 */
export function getTokenExpirationDate(token: string): Date | null {
  const payload = parseJwt(token);

  if (!payload?.exp) {
    return null;
  }

  return new Date(payload.exp * 1000);
}

/**
 * Calculate time until token expires in seconds
 */
export function getTokenTimeRemaining(expiresAt: string | number): number {
  const expirationTime =
    typeof expiresAt === 'string'
      ? new Date(expiresAt).getTime()
      : expiresAt * 1000;

  const remaining = expirationTime - Date.now();
  return Math.max(0, Math.floor(remaining / 1000));
}

/**
 * Check if a token should be refreshed (expires within threshold)
 * @param expiresAt - ISO date string or expiration timestamp
 * @param thresholdSeconds - Refresh if expires within this many seconds (default: 5 minutes)
 */
export function shouldRefreshToken(
  expiresAt: string | number,
  thresholdSeconds = 300
): boolean {
  const remaining = getTokenTimeRemaining(expiresAt);
  return remaining > 0 && remaining <= thresholdSeconds;
}

/**
 * Extract user ID from token
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = parseJwt(token);
  return payload?.sub ?? null;
}

/**
 * Extract email from token
 */
export function getEmailFromToken(token: string): string | null {
  const payload = parseJwt(token);
  return payload?.email ?? null;
}

/**
 * Extract role from token
 */
export function getRoleFromToken(token: string): string | null {
  const payload = parseJwt(token);
  return payload?.role ?? null;
}

