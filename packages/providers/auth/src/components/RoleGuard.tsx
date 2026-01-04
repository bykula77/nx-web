'use client';

import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';

interface RoleGuardProps {
  children: ReactNode;
  /**
   * Allowed roles for this route
   */
  allowedRoles: string[];
  /**
   * Path to redirect if role not allowed
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
 * Role-based access control wrapper
 * Only allows users with specified roles
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = '/unauthorized',
  loadingComponent,
  accessDeniedComponent,
}: RoleGuardProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const { hasRole } = useRole();

  if (isLoading) {
    return loadingComponent ? <>{loadingComponent}</> : null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = allowedRoles.some((role) => hasRole(role));

  if (!hasRequiredRole) {
    if (accessDeniedComponent) {
      return <>{accessDeniedComponent}</>;
    }
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}

