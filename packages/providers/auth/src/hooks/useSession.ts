import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { isTokenExpired } from '../utils/auth.utils';
import type { Session } from '../types';

interface UseSessionReturn {
  /**
   * Current session or null if not authenticated
   */
  session: Session | null;

  /**
   * Whether the session is valid and not expired
   */
  isValid: boolean;

  /**
   * Whether the session is expired
   */
  isExpired: boolean;

  /**
   * Time until session expires in seconds
   */
  expiresIn: number | null;

  /**
   * Refresh the session
   */
  refresh: () => Promise<void>;
}

/**
 * Hook to access session information
 */
export function useSession(): UseSessionReturn {
  const { session, refreshSession } = useAuth();

  const { isValid, isExpired, expiresIn } = useMemo(() => {
    if (!session) {
      return { isValid: false, isExpired: false, expiresIn: null };
    }

    const expired = isTokenExpired(session.expiresAt);
    const expiresAt = new Date(session.expiresAt).getTime();
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));

    return {
      isValid: !expired,
      isExpired: expired,
      expiresIn: remaining,
    };
  }, [session]);

  return {
    session,
    isValid,
    isExpired,
    expiresIn,
    refresh: refreshSession,
  };
}

