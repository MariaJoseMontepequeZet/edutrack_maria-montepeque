import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', 'docs/', 'coverage/'] },
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: { ...globals.browser, ...globals.commonjs, Chart: 'readonly' }
    },
    rules: {
      eqeqeq: ['error', 'always']
    }
  },
  {
    files: ['js/Validacion.js'],
    languageOptions: {
      globals: { ...globals.node }
    }
  },
  {
    files: ['test/**/*.js', '*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.node }
    }
  }
];
