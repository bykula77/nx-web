/**
 * GROQ queries for Sanity CMS
 */

import { sanityClient, getClient } from './client';
import type { Post, Author, Category, Settings } from './types';

// ═══════════════════════════════════════
// QUERY DEFINITIONS
// ═══════════════════════════════════════

/**
 * Get all published blog posts
 */
export const getAllPostsQuery = `
  *[_type == "post" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "author": author->{
      name,
      "slug": slug.current,
      "image": image.asset->url
    },
    "categories": categories[]->{
      _id,
      title,
      "slug": slug.current
    },
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt
  }
`;

/**
 * Get single post by slug
 */
export const getPostBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    publishedAt,
    "author": author->{
      name,
      "slug": slug.current,
      bio,
      "image": image.asset->url,
      social
    },
    "categories": categories[]->{
      _id,
      title,
      "slug": slug.current
    },
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    seo
  }
`;

/**
 * Get all categories
 */
export const getAllCategoriesQuery = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    color,
    icon
  }
`;

/**
 * Get all authors
 */
export const getAllAuthorsQuery = `
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    bio,
    "image": image.asset->url,
    email,
    social
  }
`;

/**
 * Get site settings
 */
export const getSettingsQuery = `
  *[_type == "settings"][0] {
    siteName,
    siteDescription,
    "logo": logo.asset->url,
    "logoAlt": logo.alt,
    "favicon": favicon.asset->url,
    "ogImage": ogImage.asset->url,
    socialLinks,
    footer,
    analytics
  }
`;

/**
 * Get posts by category
 */
export const getPostsByCategoryQuery = `
  *[_type == "post" && $categorySlug in categories[]->slug.current && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "author": author->{
      name,
      "image": image.asset->url
    },
    "mainImage": mainImage.asset->url
  }
`;

/**
 * Get posts by author
 */
export const getPostsByAuthorQuery = `
  *[_type == "post" && author->slug.current == $authorSlug && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "mainImage": mainImage.asset->url,
    "categories": categories[]->{
      title,
      "slug": slug.current
    }
  }
`;

/**
 * Get related posts (same category, excluding current)
 */
export const getRelatedPostsQuery = `
  *[_type == "post" && _id != $postId && count(categories[@._ref in $categoryIds]) > 0 && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "mainImage": mainImage.asset->url
  }
`;

// ═══════════════════════════════════════
// FETCHER FUNCTIONS
// ═══════════════════════════════════════

/**
 * Get all published posts
 */
export async function getAllPosts(preview = false): Promise<Post[]> {
  const client = getClient(preview);
  return client.fetch(getAllPostsQuery);
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(
  slug: string,
  preview = false
): Promise<Post | null> {
  const client = getClient(preview);
  return client.fetch(getPostBySlugQuery, { slug });
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  return sanityClient.fetch(getAllCategoriesQuery);
}

/**
 * Get all authors
 */
export async function getAllAuthors(): Promise<Author[]> {
  return sanityClient.fetch(getAllAuthorsQuery);
}

/**
 * Get site settings
 */
export async function getSettings(): Promise<Settings | null> {
  return sanityClient.fetch(getSettingsQuery);
}

/**
 * Get posts by category slug
 */
export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  return sanityClient.fetch(getPostsByCategoryQuery, { categorySlug });
}

/**
 * Get posts by author slug
 */
export async function getPostsByAuthor(authorSlug: string): Promise<Post[]> {
  return sanityClient.fetch(getPostsByAuthorQuery, { authorSlug });
}

/**
 * Get related posts for a given post
 */
export async function getRelatedPosts(
  postId: string,
  categoryIds: string[]
): Promise<Post[]> {
  return sanityClient.fetch(getRelatedPostsQuery, { postId, categoryIds });
}

// ═══════════════════════════════════════
// STATIC PATHS HELPERS
// ═══════════════════════════════════════

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<{ slug: string }[]>(`
    *[_type == "post" && defined(publishedAt) && publishedAt <= now()].slug.current
  `);
  return slugs;
}

/**
 * Get all category slugs for static generation
 */
export async function getAllCategorySlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[]>(`
    *[_type == "category"].slug.current
  `);
  return slugs;
}

/**
 * Get all author slugs for static generation
 */
export async function getAllAuthorSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[]>(`
    *[_type == "author"].slug.current
  `);
  return slugs;
}
