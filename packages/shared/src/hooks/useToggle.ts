import { useState, useCallback } from 'react';

/**
 * Provides a boolean state with toggle, setTrue, and setFalse functions
 * @param initialValue - The initial boolean value
 * @returns A tuple of [value, toggle, setTrue, setFalse]
 */
export function useToggle(
  initialValue = false
): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
}

