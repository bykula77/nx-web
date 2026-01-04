/**
 * Sanity Schema Exports
 *
 * These schemas are reference definitions for Sanity Studio.
 * Import them in your Sanity Studio project's schema.ts file.
 */

export { postSchema } from './post';
export { authorSchema } from './author';
export { categorySchema } from './category';
export { settingsSchema } from './settings';

// Default exports for convenience
export { default as post } from './post';
export { default as author } from './author';
export { default as category } from './category';
export { default as settings } from './settings';

// Schema type names for reference
export const SCHEMA_TYPES = {
  POST: 'post',
  AUTHOR: 'author',
  CATEGORY: 'category',
  SETTINGS: 'settings',
} as const;

export type SchemaType = (typeof SCHEMA_TYPES)[keyof typeof SCHEMA_TYPES];
