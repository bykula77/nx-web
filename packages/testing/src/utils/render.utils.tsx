import { type ReactElement, type ReactNode } from 'react';
import { render as rtlRender, type RenderOptions as RTLRenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Extended render options
 */
export interface RenderOptions extends Omit<RTLRenderOptions, 'wrapper'> {
  /**
   * Initial route for router
   */
  route?: string;

  /**
   * Whether to wrap with providers
   */
  withProviders?: boolean;

  /**
   * Custom wrapper component
   */
  wrapper?: React.ComponentType<{ children: ReactNode }>;
}

/**
 * Create a wrapper component with all providers
 */
export function createWrapper(options?: {
  route?: string;
}): React.ComponentType<{ children: ReactNode }> {
  return function Wrapper({ children }: { children: ReactNode }) {
    // Basic wrapper without external dependencies
    // In actual usage, this would include:
    // - QueryClientProvider
    // - SupabaseProvider
    // - AuthProvider
    // - Router
    return <>{children}</>;
  };
}

/**
 * Custom render function with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options: RenderOptions = {}
) {
  const { route, wrapper: CustomWrapper, ...renderOptions } = options;

  const Wrapper = CustomWrapper || createWrapper({ route });

  const result = rtlRender(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });

  return {
    ...result,
    user: userEvent.setup(),
  };
}

/**
 * Simple render with user event
 */
export function render(ui: ReactElement, options: RTLRenderOptions = {}) {
  const result = rtlRender(ui, options);

  return {
    ...result,
    user: userEvent.setup(),
  };
}

/**
 * Re-export everything from @testing-library/react
 */
export * from '@testing-library/react';
export { userEvent };

