import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginJest from "eslint-plugin-jest";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/*.spec.{js,ts,jsx,tsx}",
      "**/*.test.{js,ts,jsx,tsx}",
      "**/jest.config.{js,ts}",
      "**/eslint.config.{js,ts}",
      "**/vite.config.{js,ts}",
      "**/webpack.config.{js,ts}",
      "**/rollup.config.{js,ts}",
      "**/tailwind.config.{js,ts}",
      "**/postcss.config.{js,ts}",
      "**/dist/**",
      "**/coverage/**",
      "**/logs/**",
      "**/node_modules/**",
    ],
  },

  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:jest/recommended",
  ),
  eslintConfigPrettier,
  {
    plugins: { jest: pluginJest },

    languageOptions: {
      globals: {
        ...pluginJest.environments.globals.globals,
      },
    },

    rules: {
      // C
      camelcase: "off",
      "capitalized-comments": "off",
      "default-param-last": "error",

      // E
      eqeqeq: "error",
      "max-params": ["warn", 3],

      // N
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "no-empty-function": "warn",
      "no-param-reassign": "error",

      // P
      "padding-line-between-statements": [
        "off",
        {
          blankLine: "always",
          prev: "*",
          next: "return",
        },
        {
          blankLine: "always",
          prev: "*",
          next: "function",
        },
        {
          blankLine: "always",
          prev: "*",
          next: "block-like",
        },
        {
          blankLine: "always",
          prev: ["import"],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["import"],
          next: ["import"],
        },
        {
          blankLine: "always",
          prev: ["const", "let", "var"],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
      ],
      "prefer-const": "error",
      "prefer-destructuring": "error",
      "prefer-object-spread": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrors: "none",
          varsIgnorePattern: "^_",
        },
      ],

      "sort-keys": [
        "off",
        "asc",
        {
          natural: true,
          minKeys: 5,
        },
      ],
      "sort-vars": "error",
      "sort-imports": ["off"],
    },
  },
];
