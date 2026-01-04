import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

interface UsePermissionsReturn {
  /**
   * User's permissions array
   */
  permissions: string[];

  /**
   * Check if user has a specific permission
   */
  hasPermission: (permission: string) => boolean;

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission: (permissions: string[]) => boolean;

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions: (permissions: string[]) => boolean;
}

/**
 * Hook to access and check user permissions
 */
export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();

  const permissions = useMemo(() => user?.permissions || [], [user]);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      return permissions.includes(permission);
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (requiredPermissions: string[]): boolean => {
      return requiredPermissions.some((p) => permissions.includes(p));
    },
    [permissions]
  );

  const hasAllPermissions = useCallback(
    (requiredPermissions: string[]): boolean => {
      return requiredPermissions.every((p) => permissions.includes(p));
    },
    [permissions]
  );

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}

