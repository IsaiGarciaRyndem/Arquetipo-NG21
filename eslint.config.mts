import eslint from '@eslint/js';
import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig} from "eslint/config";
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ],
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: { globals: globals.node }
  },
  tseslint.configs.recommended,
]);
