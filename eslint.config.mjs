import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default ts.config(
  {
    ignores: ['dist/', '.astro/', 'node_modules/', 'scripts/'],
  },

  // Plain JS / TS files (config, lib).
  {
    files: ['**/*.{js,mjs,ts}'],
    extends: [js.configs.recommended, ...ts.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Astro components + the TS inside their <script> blocks.
  ...astro.configs['flat/recommended']
);
