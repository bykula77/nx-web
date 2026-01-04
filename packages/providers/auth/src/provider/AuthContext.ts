import { createContext } from 'react';
import type { User, Session, AuthState, SignInCredentials, SignUpCredentials } from '../types';

/**
 * Auth context value interface
 */
export interface AuthContextValue extends AuthState {
  /**
   * Sign in with email and password
   */
  signIn: (credentials: SignInCredentials) => Promise<void>;

  /**
   * Sign up with email and password
   */
  signUp: (credentials: SignUpCredentials) => Promise<void>;

  /**
   * Sign out current user
   */
  signOut: () => Promise<void>;

  /**
   * Sign in with OAuth provider
   */
  signInWithOAuth: (provider: 'google' | 'github' | 'facebook') => Promise<void>;

  /**
   * Send password reset email
   */
  resetPassword: (email: string) => Promise<void>;

  /**
   * Update password
   */
  updatePassword: (newPassword: string) => Promise<void>;

  /**
   * Refresh session
   */
  refreshSession: () => Promise<void>;

  /**
   * Update user profile
   */
  updateProfile: (data: Partial<User>) => Promise<void>;
}

/**
 * Auth context
 */
export const AuthContext = createContext<AuthContextValue | null>(null);

