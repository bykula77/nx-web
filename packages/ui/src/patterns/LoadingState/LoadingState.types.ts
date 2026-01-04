import type { ReactNode } from 'react';

/**
 * Loading mode
 */
export type LoadingMode = 'spinner' | 'skeleton';

/**
 * LoadingState component props
 */
export interface LoadingStateProps {
  /**
   * Loading state
   */
  loading: boolean;

  /**
   * Loading mode
   * @default 'spinner'
   */
  mode?: LoadingMode;

  /**
   * Content to show when not loading
   */
  children?: ReactNode;

  /**
   * Overlay mode - shows content with loading overlay
   */
  overlay?: boolean;

  /**
   * Loading text
   */
  text?: string;

  /**
   * Full height container
   */
  fullHeight?: boolean;

  /**
   * Number of skeleton rows (for skeleton mode)
   */
  skeletonRows?: number;
}

