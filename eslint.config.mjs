// ESLint Flat Config for monorepo: JS/TS/Vue + Prettier
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'dist-dev/**',
      'packages/*/dist/**',
      'packages/*/dist-dev/**',
      'pnpm-lock.yaml',
    ],
  },

  // Base JS recommendations
  js.configs.recommended,

  // TypeScript recommendations (non type-checked, fast and simple)
  ...tseslint.configs.recommended,

  // Vue 3 recommendations (flat config)
  ...vue.configs['flat/recommended'],

  // Common language options and Prettier integration
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parserOptions: {
        // Use TS parser inside Vue <script> blocks and TS files
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Run Prettier as an ESLint rule and error on deviations
      'prettier/prettier': 'error',
    },
  },

  // Disable rules that conflict with Prettier formatting
  eslintConfigPrettier,
];
