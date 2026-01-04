/**
 * Makes all properties visible in IDE tooltips
 * Useful for complex intersection types
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Requires at least one of the specified keys
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * Requires exactly one of the specified keys
 */
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, never>>;
  }[Keys];

/**
 * Makes specified keys required
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Makes specified keys optional
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Extracts keys that have values of a specific type
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Extracts only string keys from an object
 */
export type StringKeys<T> = Extract<keyof T, string>;

/**
 * Makes all properties mutable (removes readonly)
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Deep mutable - removes readonly recursively
 */
export type DeepMutable<T> = T extends object
  ? {
      -readonly [P in keyof T]: DeepMutable<T[P]>;
    }
  : T;

/**
 * Gets the value type of an object
 */
export type ValueOf<T> = T[keyof T];

/**
 * Gets the element type of an array
 */
export type ArrayElement<T extends readonly unknown[]> =
  T extends readonly (infer E)[] ? E : never;

/**
 * Creates a union of all possible dot-notation paths in an object
 */
export type DotNotationKeys<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${Prefix}${K}` | DotNotationKeys<T[K], `${Prefix}${K}.`>
          : `${Prefix}${K}`
        : never;
    }[keyof T]
  : never;

/**
 * Infers the return type of a function, including async functions
 */
export type AsyncReturnType<T extends (...args: unknown[]) => unknown> =
  T extends (...args: unknown[]) => Promise<infer R>
    ? R
    : T extends (...args: unknown[]) => infer R
      ? R
      : never;

/**
 * Creates a type where all properties are functions
 */
export type FunctionProperties<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
};

/**
 * Creates a type where all properties are non-functions
 */
export type NonFunctionProperties<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : T[K];
};

/**
 * Branded type for type-safe primitives
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * Removes brand from a branded type
 */
export type Unbrand<T> = T extends Brand<infer U, unknown> ? U : T;

