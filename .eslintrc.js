/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    env: {
      browser: true,
      es2022: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    ignorePatterns: [
      'node_modules/',
      'dist/',
      '.astro/',
      '.turbo/',
      'coverage/',
    ],
    rules: {
      'no-console': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  };