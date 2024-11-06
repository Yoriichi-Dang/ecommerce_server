import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import tseslintPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'], // Match JS, MJS, CJS, and TS files
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json' // Ensure this points to your correct tsconfig.json path
      },
      globals: globals.node
    },
    plugins: {
      prettier: eslintPluginPrettier,
      '@typescript-eslint': tseslintPlugin
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslintPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'error',
      'consistent-return': 'off',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/consistent-return': 'error',
      '@typescript-eslint/consistent-indexed-object-style': 'error',
      'no-console': 'warn', // Warn on console.log usage
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'always',
          semi: false,
          trailingComma: 'none',
          tabWidth: 2,
          endOfLine: 'auto',
          useTabs: false,
          singleQuote: true,
          printWidth: 120,
          jsxSingleQuote: true
        }
      ]
    },
    ignores: ['**/node_modules/', '**/dist/']
  }
]
