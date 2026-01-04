/**
 * GROQ queries for Sanity CMS
 */

/**
 * Get all blog posts
 */
export const getAllPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "author": author->{
      name,
      "image": image.asset->url
    },
    "category": category->{
      title,
      slug
    },
    "mainImage": mainImage.asset->url
  }
`;

/**
 * Get single post by slug
 */
export const getPostBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    publishedAt,
    "author": author->{
      name,
      bio,
      "image": image.asset->url
    },
    "category": category->{
      title,
      slug
    },
    "mainImage": mainImage.asset->url
  }
`;

/**
 * Get site settings
 */
export const getSettingsQuery = `
  *[_type == "settings"][0] {
    title,
    description,
    "logo": logo.asset->url,
    socialLinks
  }
`;

/**
 * Get all categories
 */
export const getAllCategoriesQuery = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`;

/**
 * Get posts by category
 */
export const getPostsByCategoryQuery = `
  *[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "author": author->{
      name,
      "image": image.asset->url
    },
    "mainImage": mainImage.asset->url
  }
`;

