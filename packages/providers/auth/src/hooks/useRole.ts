import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { ROLE_HIERARCHY, type Role } from '../utils/roles';

interface UseRoleReturn {
  /**
   * User's current role
   */
  role: string | null;

  /**
   * Check if user has a specific role
   */
  hasRole: (role: string) => boolean;

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole: (roles: string[]) => boolean;

  /**
   * Check if user's role is at least the specified level (using hierarchy)
   */
  hasRoleLevel: (minRole: Role) => boolean;

  /**
   * Check if user is admin
   */
  isAdmin: boolean;

  /**
   * Check if user is super admin
   */
  isSuperAdmin: boolean;
}

/**
 * Hook to access and check user role
 */
export function useRole(): UseRoleReturn {
  const { user } = useAuth();

  const role = useMemo(() => user?.role || null, [user]);

  const hasRole = useCallback(
    (checkRole: string): boolean => {
      return role === checkRole;
    },
    [role]
  );

  const hasAnyRole = useCallback(
    (roles: string[]): boolean => {
      if (!role) return false;
      return roles.includes(role);
    },
    [role]
  );

  const hasRoleLevel = useCallback(
    (minRole: Role): boolean => {
      if (!role) return false;

      const userRoleLevel = ROLE_HIERARCHY[role as Role] ?? 0;
      const minRoleLevel = ROLE_HIERARCHY[minRole] ?? 0;

      return userRoleLevel >= minRoleLevel;
    },
    [role]
  );

  const isAdmin = useMemo(
    () => role === 'admin' || role === 'super_admin',
    [role]
  );

  const isSuperAdmin = useMemo(() => role === 'super_admin', [role]);

  return {
    role,
    hasRole,
    hasAnyRole,
    hasRoleLevel,
    isAdmin,
    isSuperAdmin,
  };
}

