import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from '../provider/AuthContext';

/**
 * Hook to access auth state and methods
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

