/**
 * Sanity CMS Types
 */

// ═══════════════════════════════════════
// PRIMITIVE TYPES
// ═══════════════════════════════════════

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface SanityReference {
  _type: 'reference';
  _ref: string;
}

// Portable Text block types
export interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style?: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote';
  children: Array<{
    _type: 'span';
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _type: string;
    _key: string;
    href?: string;
    blank?: boolean;
  }>;
}

export interface PortableTextImage {
  _type: 'image';
  _key: string;
  asset: {
    _ref: string;
    url?: string;
  };
  alt?: string;
  caption?: string;
}

export interface PortableTextCode {
  _type: 'code';
  _key: string;
  code: string;
  language?: string;
  filename?: string;
}

export type PortableTextContent = PortableTextBlock | PortableTextImage | PortableTextCode;

// ═══════════════════════════════════════
// DOCUMENT TYPES
// ═══════════════════════════════════════

export interface Author {
  _id?: string;
  name: string;
  slug?: string;
  bio?: PortableTextBlock[] | string;
  image?: string;
  email?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface Category {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: PortableTextContent[];
  publishedAt: string;
  author?: Author;
  categories?: Category[];
  mainImage?: string;
  mainImageAlt?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}

export interface Settings {
  siteName: string;
  siteDescription?: string;
  logo?: string;
  logoAlt?: string;
  favicon?: string;
  ogImage?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    discord?: string;
  };
  footer?: {
    copyright?: string;
    links?: Array<{
      title: string;
      href: string;
    }>;
  };
  analytics?: {
    googleAnalyticsId?: string;
    plausibleDomain?: string;
  };
}

// ═══════════════════════════════════════
// API RESPONSE TYPES
// ═══════════════════════════════════════

export interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  author?: Pick<Author, 'name' | 'image'>;
  categories?: Pick<Category, 'title' | 'slug'>[];
  mainImage?: string;
}

export interface AuthorWithPosts extends Author {
  posts?: PostListItem[];
}

export interface CategoryWithPosts extends Category {
  posts?: PostListItem[];
}
