'use client';

import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import type { PermissionCheck } from '../types';

interface PermissionGuardProps {
  children: ReactNode;
  /**
   * Required permissions for this route
   */
  requiredPermissions: string[];
  /**
   * Permission check mode
   * - 'all': User must have ALL permissions
   * - 'any': User must have at least ONE permission
   * @default 'all'
   */
  checkMode?: PermissionCheck;
  /**
   * Path to redirect if permission not granted
   * @default '/unauthorized'
   */
  fallbackPath?: string;
  /**
   * Loading component to show while checking
   */
  loadingComponent?: ReactNode;
  /**
   * Component to show when access is denied
   */
  accessDeniedComponent?: ReactNode;
}

/**
 * Permission-based access control wrapper
 * Only allows users with specified permissions
 */
export function PermissionGuard({
  children,
  requiredPermissions,
  checkMode = 'all',
  fallbackPath = '/unauthorized',
  loadingComponent,
  accessDeniedComponent,
}: PermissionGuardProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  if (isLoading) {
    return loadingComponent ? <>{loadingComponent}</> : null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess =
    checkMode === 'all'
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    if (accessDeniedComponent) {
      return <>{accessDeniedComponent}</>;
    }
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}

