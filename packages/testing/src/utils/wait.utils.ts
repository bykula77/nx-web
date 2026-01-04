import { waitFor as rtlWaitFor, screen } from '@testing-library/react';

/**
 * Default timeout for wait operations
 */
const DEFAULT_TIMEOUT = 5000;

/**
 * Wait for an element to appear in the DOM
 */
export async function waitForElement(
  testId: string,
  options?: { timeout?: number }
): Promise<HTMLElement> {
  const { timeout = DEFAULT_TIMEOUT } = options || {};

  return rtlWaitFor(() => screen.getByTestId(testId), {
    timeout,
  });
}

/**
 * Wait for text to appear in the DOM
 */
export async function waitForText(
  text: string | RegExp,
  options?: { timeout?: number; exact?: boolean }
): Promise<HTMLElement> {
  const { timeout = DEFAULT_TIMEOUT, exact = false } = options || {};

  return rtlWaitFor(
    () => screen.getByText(text, { exact }),
    { timeout }
  );
}

/**
 * Wait for an element to disappear from the DOM
 */
export async function waitForElementToDisappear(
  testId: string,
  options?: { timeout?: number }
): Promise<void> {
  const { timeout = DEFAULT_TIMEOUT } = options || {};

  await rtlWaitFor(
    () => {
      expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
    },
    { timeout }
  );
}

/**
 * Wait for loading state to finish
 * Looks for common loading indicators and waits for them to disappear
 */
export async function waitForLoadingToFinish(
  options?: { timeout?: number; loadingTestId?: string }
): Promise<void> {
  const { timeout = DEFAULT_TIMEOUT, loadingTestId = 'loading' } = options || {};

  // Wait a tick to ensure loading has started
  await new Promise((resolve) => setTimeout(resolve, 0));

  // Wait for loading to disappear
  await rtlWaitFor(
    () => {
      const loadingElement = screen.queryByTestId(loadingTestId);
      const spinners = screen.queryAllByRole('progressbar');
      const skeletons = screen.queryAllByTestId(/skeleton/i);

      if (loadingElement || spinners.length > 0 || skeletons.length > 0) {
        throw new Error('Still loading');
      }
    },
    { timeout }
  );
}

/**
 * Wait for a request to be made (with MSW)
 */
export async function waitForRequest(
  url: string | RegExp,
  options?: { timeout?: number; method?: string }
): Promise<void> {
  const { timeout = DEFAULT_TIMEOUT } = options || {};

  // This is a placeholder - actual implementation would use MSW events
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * Re-export waitFor from testing-library with better typing
 */
export async function waitFor<T>(
  callback: () => T | Promise<T>,
  options?: { timeout?: number; interval?: number }
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, interval = 50 } = options || {};

  return rtlWaitFor(callback, { timeout, interval });
}

/**
 * Wait for a condition to be true
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  options?: { timeout?: number; interval?: number }
): Promise<void> {
  const { timeout = DEFAULT_TIMEOUT, interval = 50 } = options || {};
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await condition();
    if (result) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error('Condition not met within timeout');
}

/**
 * Wait for multiple elements to appear
 */
export async function waitForElements(
  testIds: string[],
  options?: { timeout?: number }
): Promise<HTMLElement[]> {
  const { timeout = DEFAULT_TIMEOUT } = options || {};

  return rtlWaitFor(
    () => {
      return testIds.map((testId) => screen.getByTestId(testId));
    },
    { timeout }
  );
}

/**
 * Wait for an async operation and return the result
 */
export async function waitForAsync<T>(
  asyncFn: () => Promise<T>,
  options?: { timeout?: number; retries?: number }
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, retries = 3 } = options || {};
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      const result = await Promise.race([
        asyncFn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ]);
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  throw lastError || new Error('Async operation failed');
}

/**
 * Pause execution for debugging
 */
export function pause(ms = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

