// @ts-check

// @ts-expect-error: Should not be considered in lint
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
 eslint.configs.recommended,
 ...tseslint.configs.recommended,
 ...tseslint.configs.recommendedTypeChecked,
 ...tseslint.configs.stylisticTypeChecked,
 {
     languageOptions: {
         parserOptions: {
             project: ['tsconfig.json'],
             tsconfigDirName: import.meta.dirname,
         },
     },
 },
 {
     files: ['**/*.{ts,tsx,mts,cts,mjs}'],
     extends: [tseslint.configs.disableTypeChecked],
     ignores: ["./tailwind.config.js", "./prettier.config.js"],
     rules: {},
 },
);