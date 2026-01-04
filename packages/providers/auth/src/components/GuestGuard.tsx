'use client';

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface GuestGuardProps {
  children: ReactNode;
  /**
   * Path to redirect authenticated users
   * @default '/dashboard'
   */
  redirectPath?: string;
  /**
   * Loading component to show while checking auth
   */
  loadingComponent?: ReactNode;
}

/**
 * Guest route wrapper
 * Redirects to dashboard if user is already authenticated
 * Use this for login/register pages
 */
export function GuestGuard({
  children,
  redirectPath = '/dashboard',
  loadingComponent,
}: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return loadingComponent ? <>{loadingComponent}</> : null;
  }

  if (isAuthenticated) {
    // Redirect to the page they came from or dashboard
    const from = (location.state as { from?: string })?.from || redirectPath;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

