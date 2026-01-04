module.exports = {
  extends: ['@nx-web/eslint-config/base', 'plugin:astro/recommended'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['dist/', 'node_modules/', '.astro/', 'env.d.ts'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
    {
      // Sanity schemas use any for field definitions
      files: ['src/sanity/schemas/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      // Allow console in client utility files
      files: ['src/sanity/client.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};

