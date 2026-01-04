/**
 * Category Schema
 *
 * Sanity schema definition for blog categories
 * Use this as reference when setting up Sanity Studio
 */
export const categorySchema = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Category badge color (hex code)',
      validation: (Rule: any) =>
        Rule.regex(/^#[0-9A-Fa-f]{6}$/, {
          name: 'hex color',
          invert: false,
        }),
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name from your icon library',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
};

export default categorySchema;

