import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import unusedImports from 'eslint-plugin-unused-imports';
import angular from 'angular-eslint';

export default defineConfig([
  {
    // Archivos de configuración Node.js / CommonJS (jest, eslint, tsconfig helpers…)
    files: ['**/*.{js,cjs,mjs}'],
    extends: [eslint.configs.recommended],
    languageOptions: { globals: { ...globals.node, ...globals.commonjs } },
  },
  {
    // Código fuente Angular (TypeScript)
    files: ['**/*.{ts,mts,cts}'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: { globals: globals.browser },
    processor: angular.processInlineTemplates,
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
]);
