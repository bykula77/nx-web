/**
 * User type
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
  permissions: string[];
  emailVerified: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Session type
 */
export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  expiresIn: number;
}

/**
 * Auth state
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

/**
 * Sign in credentials
 */
export interface SignInCredentials {
  email: string;
  password: string;
}

/**
 * Sign up credentials
 */
export interface SignUpCredentials {
  email: string;
  password: string;
  fullName?: string;
  metadata?: Record<string, unknown>;
}

/**
 * OAuth providers
 */
export type OAuthProvider = 'google' | 'github' | 'facebook' | 'apple' | 'twitter';

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password update request
 */
export interface PasswordUpdateRequest {
  currentPassword?: string;
  newPassword: string;
}

/**
 * Profile update request
 */
export interface ProfileUpdateRequest {
  fullName?: string;
  avatarUrl?: string;
  metadata?: Record<string, unknown>;
}

