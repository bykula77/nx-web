'use client';

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode;
  /**
   * Path to redirect unauthenticated users
   * @default '/login'
   */
  loginPath?: string;
  /**
   * Loading component to show while checking auth
   */
  loadingComponent?: ReactNode;
}

/**
 * Protected route wrapper
 * Redirects to login if user is not authenticated
 */
export function AuthGuard({
  children,
  loginPath = '/login',
  loadingComponent,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return loadingComponent ? <>{loadingComponent}</> : null;
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return (
      <Navigate
        to={loginPath}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}

