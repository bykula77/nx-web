/**
 * Splits an array into chunks of a specified size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [];

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Returns unique values from an array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Returns unique values from an array based on a key selector
 */
export function uniqueBy<T, K>(array: T[], keySelector: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter((item) => {
    const key = keySelector(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Groups array elements by a key selector
 */
export function groupBy<T, K extends string | number>(
  array: T[],
  keySelector: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (result, item) => {
      const key = keySelector(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    },
    {} as Record<K, T[]>
  );
}

/**
 * Sorts an array by a key selector
 */
export function sortBy<T>(
  array: T[],
  keySelector: (item: T) => string | number,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  const sorted = [...array].sort((a, b) => {
    const aKey = keySelector(a);
    const bKey = keySelector(b);

    if (typeof aKey === 'string' && typeof bKey === 'string') {
      return aKey.localeCompare(bKey, 'tr');
    }

    return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
  });

  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Returns the first element of an array or undefined
 */
export function first<T>(array: T[]): T | undefined {
  return array[0];
}

/**
 * Returns the last element of an array or undefined
 */
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

/**
 * Flattens a nested array to a specified depth
 */
export function flatten<T>(array: (T | T[])[], depth = 1): T[] {
  return array.flat(depth) as T[];
}

/**
 * Returns the intersection of two arrays
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  const set = new Set(array2);
  return array1.filter((item) => set.has(item));
}

/**
 * Returns the difference between two arrays
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  const set = new Set(array2);
  return array1.filter((item) => !set.has(item));
}

/**
 * Checks if an array is empty
 */
export function isEmpty<T>(array: T[]): boolean {
  return array.length === 0;
}

/**
 * Creates an array of numbers in a range
 */
export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

