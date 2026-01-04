/**
 * Sanity CMS types
 */

export interface Author {
  name: string;
  bio?: string;
  image?: string;
}

export interface Category {
  _id?: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  body?: unknown[]; // Portable Text
  publishedAt: string;
  author?: Author;
  category?: Category;
  mainImage?: string;
}

export interface Settings {
  title: string;
  description: string;
  logo?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

