/**
 * Factory configuration
 */
export interface FactoryConfig<T> {
  /**
   * Default values or value generators for each field
   */
  defaults: {
    [K in keyof T]: T[K] | (() => T[K]);
  };

  /**
   * Post-build hook to modify the created object
   */
  afterBuild?: (entity: T) => T;
}

/**
 * Factory interface
 */
export interface Factory<T> {
  /**
   * Build a single entity
   */
  build: (overrides?: Partial<T>) => T;

  /**
   * Build multiple entities
   */
  buildMany: (count: number, overrides?: Partial<T> | ((index: number) => Partial<T>)) => T[];

  /**
   * Build with specific traits
   */
  with: (overrides: Partial<T>) => Factory<T>;
}

/**
 * Create a factory for generating test data
 */
export function createFactory<T extends Record<string, unknown>>(
  config: FactoryConfig<T>
): Factory<T> {
  const { defaults, afterBuild } = config;

  const build = (overrides?: Partial<T>): T => {
    const entity = {} as T;

    // Apply defaults
    for (const key of Object.keys(defaults) as (keyof T)[]) {
      const defaultValue = defaults[key];
      entity[key] =
        typeof defaultValue === 'function'
          ? (defaultValue as () => T[keyof T])()
          : defaultValue;
    }

    // Apply overrides
    if (overrides) {
      Object.assign(entity, overrides);
    }

    // Apply afterBuild hook
    if (afterBuild) {
      return afterBuild(entity);
    }

    return entity;
  };

  const buildMany = (
    count: number,
    overrides?: Partial<T> | ((index: number) => Partial<T>)
  ): T[] => {
    return Array.from({ length: count }, (_, index) => {
      const entityOverrides =
        typeof overrides === 'function' ? overrides(index) : overrides;
      return build(entityOverrides);
    });
  };

  const withOverrides = (staticOverrides: Partial<T>): Factory<T> => {
    return createFactory({
      defaults: {
        ...defaults,
        ...staticOverrides,
      } as FactoryConfig<T>['defaults'],
      afterBuild,
    });
  };

  return {
    build,
    buildMany,
    with: withOverrides,
  };
}

/**
 * Sequence counter for generating unique values
 */
let sequenceCounters: Record<string, number> = {};

/**
 * Generate sequential values
 */
export function sequence(name: string, format?: (n: number) => string): () => string {
  if (!(name in sequenceCounters)) {
    sequenceCounters[name] = 0;
  }

  return () => {
    sequenceCounters[name]++;
    const n = sequenceCounters[name];
    return format ? format(n) : `${name}-${n}`;
  };
}

/**
 * Reset sequence counters (call in beforeEach)
 */
export function resetSequences(): void {
  sequenceCounters = {};
}

/**
 * Pick a random value from an array
 */
export function oneOf<T>(values: T[]): () => T {
  return () => {
    const index = Math.floor(Math.random() * values.length);
    return values[index];
  };
}

/**
 * Maybe return a value or undefined
 */
export function maybe<T>(value: T | (() => T), probability = 0.5): () => T | undefined {
  return () => {
    if (Math.random() < probability) {
      return typeof value === 'function' ? (value as () => T)() : value;
    }
    return undefined;
  };
}

/**
 * Pick random items from an array
 */
export function pick<T>(values: T[], count: number): () => T[] {
  return () => {
    const shuffled = [...values].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };
}

/**
 * Generate a random string
 */
export function randomString(length = 10): () => string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return () => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
}

/**
 * Generate a random number within a range
 */
export function randomNumber(min: number, max: number): () => number {
  return () => Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random date within a range
 */
export function randomDate(start?: Date, end?: Date): () => Date {
  const startTime = start?.getTime() || Date.now() - 365 * 24 * 60 * 60 * 1000;
  const endTime = end?.getTime() || Date.now();

  return () => {
    const time = startTime + Math.random() * (endTime - startTime);
    return new Date(time);
  };
}

/**
 * Generate a UUID
 */
export function uuid(): () => string {
  return () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
}

/**
 * Generate an email
 */
export function email(domain = 'test.com'): () => string {
  const seq = sequence('email');
  return () => `user-${seq().split('-')[1]}@${domain}`;
}

