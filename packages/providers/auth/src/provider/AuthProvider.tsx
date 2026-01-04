'use client';

import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { useSupabase } from '@nx-web/supabase';
import { AuthContext, type AuthContextValue } from './AuthContext';
import type {
  User,
  Session,
  AuthState,
  SignInCredentials,
  SignUpCredentials,
} from '../types';

interface AuthProviderProps {
  children: ReactNode;
  /**
   * Redirect URL after OAuth sign in
   */
  redirectUrl?: string;
}

/**
 * Auth provider component
 * Manages authentication state using Supabase Auth
 */
export function AuthProvider({ children, redirectUrl }: AuthProviderProps) {
  const supabase = useSupabase();

  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          const user = mapSupabaseUser(session.user);
          setState({
            user,
            session: mapSupabaseSession(session),
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          setState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
          error: error instanceof Error ? error : new Error('Auth initialization failed'),
        });
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const user = mapSupabaseUser(session.user);
          setState({
            user,
            session: mapSupabaseSession(session),
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          setState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Sign in with email/password
  const signIn = useCallback(
    async (credentials: SignInCredentials) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) throw error;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Sign in failed'),
        }));
        throw error;
      }
    },
    [supabase]
  );

  // Sign up with email/password
  const signUp = useCallback(
    async (credentials: SignUpCredentials) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: {
              full_name: credentials.fullName,
              ...credentials.metadata,
            },
          },
        });

        if (error) throw error;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Sign up failed'),
        }));
        throw error;
      }
    },
    [supabase]
  );

  // Sign out
  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Sign out failed'),
      }));
      throw error;
    }
  }, [supabase]);

  // Sign in with OAuth
  const signInWithOAuth = useCallback(
    async (provider: 'google' | 'github' | 'facebook') => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: redirectUrl,
          },
        });

        if (error) throw error;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error('OAuth sign in failed'),
        }));
        throw error;
      }
    },
    [supabase, redirectUrl]
  );

  // Reset password
  const resetPassword = useCallback(
    async (email: string) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });

        if (error) throw error;
      } catch (error) {
        throw error instanceof Error ? error : new Error('Password reset failed');
      }
    },
    [supabase, redirectUrl]
  );

  // Update password
  const updatePassword = useCallback(
    async (newPassword: string) => {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) throw error;
      } catch (error) {
        throw error instanceof Error ? error : new Error('Password update failed');
      }
    },
    [supabase]
  );

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      if (error) throw error;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Session refresh failed');
    }
  }, [supabase]);

  // Update profile
  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      try {
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: data.fullName,
            avatar_url: data.avatarUrl,
            ...data.metadata,
          },
        });

        if (error) throw error;
      } catch (error) {
        throw error instanceof Error ? error : new Error('Profile update failed');
      }
    },
    [supabase]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn,
      signUp,
      signOut,
      signInWithOAuth,
      resetPassword,
      updatePassword,
      refreshSession,
      updateProfile,
    }),
    [
      state,
      signIn,
      signUp,
      signOut,
      signInWithOAuth,
      resetPassword,
      updatePassword,
      refreshSession,
      updateProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Helper functions to map Supabase types to our types
function mapSupabaseUser(supabaseUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    fullName: (supabaseUser.user_metadata?.full_name as string) || '',
    avatarUrl: supabaseUser.user_metadata?.avatar_url as string | undefined,
    role: (supabaseUser.app_metadata?.role as string) || 'user',
    permissions: (supabaseUser.app_metadata?.permissions as string[]) || [],
    emailVerified: !!supabaseUser.email,
    metadata: supabaseUser.user_metadata || {},
    createdAt: supabaseUser.created_at || new Date().toISOString(),
    updatedAt: supabaseUser.updated_at || new Date().toISOString(),
  };
}

function mapSupabaseSession(supabaseSession: {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  expires_in?: number;
}): Session {
  return {
    accessToken: supabaseSession.access_token,
    refreshToken: supabaseSession.refresh_token || '',
    expiresAt: supabaseSession.expires_at
      ? new Date(supabaseSession.expires_at * 1000).toISOString()
      : new Date(Date.now() + (supabaseSession.expires_in || 3600) * 1000).toISOString(),
    expiresIn: supabaseSession.expires_in || 3600,
  };
}

