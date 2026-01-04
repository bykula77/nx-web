import { useAuth } from './useAuth';
import type { User } from '../types';

interface UseUserReturn {
  /**
   * Current user or null if not authenticated
   */
  user: User | null;

  /**
   * Whether the user data is loading
   */
  isLoading: boolean;

  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * Update user profile
   */
  updateProfile: (data: Partial<User>) => Promise<void>;
}

/**
 * Hook to access current user information
 */
export function useUser(): UseUserReturn {
  const { user, isLoading, isAuthenticated, updateProfile } = useAuth();

  return {
    user,
    isLoading,
    isAuthenticated,
    updateProfile,
  };
}

