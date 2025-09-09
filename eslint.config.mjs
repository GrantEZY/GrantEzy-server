// eslint.config.ts
import preferArrow from "eslint-plugin-prefer-arrow";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import eslint from "@eslint/js";
import tseslint, {parser} from "typescript-eslint";

export default tseslint.config(
    // 🔹 Global ignores (applied to all blocks)
    {
        ignores: [
            "**/dist/**",
            "**/coverage/**",
            "**/node_modules/**",
            "**/fixtures/**",
            "**/test/**",
            "**/*.spec.ts",
            "**/*.e2e-spec.ts",
            "**/commitlint.config.*",
            "**/eslint.config.mjs",
            "**/vitest.config.mts",
        ],
    },

    // 🔹 ESLint recommended base
    eslint.configs.recommended,

    // 🔹 TypeScript recommended configs
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,

    // 🔹 Project-specific TypeScript + rules
    {
        languageOptions: {
            parser,
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node,
            },
            parserOptions: {
                project: "./tsconfig.lint.json",
            },
        },
        rules: {
            "@typescript-eslint/no-unnecessary-condition": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",

            // naming convention rules
            "@typescript-eslint/naming-convention": [
                "error",
                {selector: "default", format: null},
                {
                    selector: "variable",
                    format: ["PascalCase", "UPPER_CASE"],
                    types: ["boolean"],
                    prefix: ["is", "should", "has", "can", "did", "will"],
                },
                {
                    selector: "variableLike",
                    format: ["camelCase", "UPPER_CASE", "PascalCase"],
                },
                {selector: "parameter", format: ["camelCase"]},
                {
                    selector: "memberLike",
                    modifiers: ["private"],
                    format: ["camelCase"],
                    leadingUnderscore: "forbid",
                },
                {selector: "typeLike", format: ["PascalCase"]},
                {
                    selector: "property",
                    modifiers: ["readonly"],
                    format: ["PascalCase"],
                },
                {selector: "enumMember", format: ["UPPER_CASE"]},
            ],
        },
    },

    // 🔹 Plugins: unicorn + prefer-arrow
    {
        languageOptions: {
            globals: globals.builtin,
        },
        plugins: {
            unicorn,
            preferArrow,
        },
        rules: {
            "unicorn/filename-case": [
                "warn",
                {
                    cases: {
                        camelCase: true,
                        pascalCase: true,
                    },
                },
            ],

            // turn off noisy/unwanted rules
            "unicorn/no-fn-reference-in-iterator": "off",
            "@typescript-eslint/no-extraneous-class": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "unicorn/no-array-for-each": "off",
            "unicorn/no-null": "off",
            "unicorn/prefer-array-some": "off",
            "unicorn/consistent-destructuring": "off",
            "unicorn/no-array-reduce": "off",
            "unicorn/prefer-spread": "off",
            "unicorn/no-array-callback-reference": "off",
            "unicorn/consistent-function-scoping": "off",
            "unicorn/no-useless-undefined": "off",
            "unicorn/prefer-ternary": "off",
            "unicorn/prefer-node-protocol": "off",

            // allow common abbreviations in Node/Express
            "unicorn/prevent-abbreviations": [
                "error",
                {
                    allowList: {
                        Param: true,
                        Req: true,
                        Res: true,
                    },
                },
            ],
        },
    }
);
