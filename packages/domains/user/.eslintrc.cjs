module.exports = {
  extends: ['@nx-web/eslint-config/react'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['dist/', 'node_modules/', 'vitest.config.ts', '__tests__/'],
};

