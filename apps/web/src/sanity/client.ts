import { createClient, type ClientConfig } from '@sanity/client';

/**
 * Sanity client configuration
 */
const config: ClientConfig = {
  projectId: import.meta.env.SANITY_PROJECT_ID || 'x0rxgcfx',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: import.meta.env.SANITY_API_VERSION || '2024-01-01',
  // Use CDN for production, disable for preview/draft content
  useCdn: import.meta.env.PROD && !import.meta.env.SANITY_PREVIEW,
};

/**
 * Public Sanity client (no authentication)
 * Use for fetching published content
 */
export const sanityClient = createClient(config);

/**
 * Authenticated Sanity client (with token)
 * Use for fetching draft/preview content or mutations
 */
export function getAuthenticatedClient(token?: string) {
  const authToken = token || import.meta.env.SANITY_API_TOKEN;

  if (!authToken) {
    console.warn('No Sanity API token provided, using public client');
    return sanityClient;
  }

  return createClient({
    ...config,
    useCdn: false, // Always disable CDN for authenticated requests
    token: authToken,
  });
}

/**
 * Preview client for draft content
 */
export const previewClient = createClient({
  ...config,
  useCdn: false,
  perspective: 'previewDrafts',
});

/**
 * Helper to choose the right client based on preview mode
 */
export function getClient(preview = false) {
  return preview ? previewClient : sanityClient;
}

// Export config for reference
export { config as sanityConfig };
