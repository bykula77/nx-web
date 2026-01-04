import type { ReactNode } from 'react';

/**
 * AuthLayout component props
 */
export interface AuthLayoutProps {
  /**
   * Page content (login/register form)
   */
  children: ReactNode;

  /**
   * Logo component
   */
  logo?: ReactNode;

  /**
   * Title
   */
  title?: ReactNode;

  /**
   * Subtitle
   */
  subtitle?: ReactNode;

  /**
   * Footer content
   */
  footer?: ReactNode;

  /**
   * Background image URL
   */
  backgroundImage?: string;

  /**
   * Max width of the content card
   */
  maxWidth?: number;
}

