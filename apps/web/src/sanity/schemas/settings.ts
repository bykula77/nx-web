/**
 * Site Settings Schema
 *
 * Sanity schema definition for global site settings
 * Use this as reference when setting up Sanity Studio
 */
export const settingsSchema = {
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  // Singleton - only one document of this type
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Used for SEO meta description',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Upload a square image (32x32 or 64x64)',
    },
    {
      name: 'ogImage',
      title: 'Default Open Graph Image',
      type: 'image',
      description: 'Default image for social sharing (1200x630)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'url',
        },
        {
          name: 'github',
          title: 'GitHub',
          type: 'url',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        },
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
        },
        {
          name: 'discord',
          title: 'Discord',
          type: 'url',
        },
      ],
    },
    {
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        {
          name: 'copyright',
          title: 'Copyright Text',
          type: 'string',
          description: 'e.g., © 2024 Company Name. All rights reserved.',
        },
        {
          name: 'links',
          title: 'Footer Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                },
                {
                  name: 'href',
                  title: 'URL',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      fields: [
        {
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'e.g., G-XXXXXXXXXX',
        },
        {
          name: 'plausibleDomain',
          title: 'Plausible Domain',
          type: 'string',
          description: 'Domain configured in Plausible',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'siteName',
      media: 'logo',
    },
    prepare(selection: { title: string; media: any }) {
      return {
        title: selection.title || 'Site Settings',
        media: selection.media,
      };
    },
  },
};

export default settingsSchema;

