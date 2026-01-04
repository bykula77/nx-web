import { useState, useCallback } from 'react';

/**
 * Provides copy-to-clipboard functionality
 * @returns A tuple of [copiedText, copy, reset]
 */
export function useCopyToClipboard(): [
  string | null,
  (text: string) => Promise<boolean>,
  () => void,
] {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not available');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      setCopiedText(null);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setCopiedText(null);
  }, []);

  return [copiedText, copy, reset];
}

