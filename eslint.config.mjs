import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import react from "eslint-plugin-react";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
  "public/smarttag.js",
  "**/coverage/",
  "**/dist/",
  "**/node_modules/",
  "public/assets/",
  "**/temp/",
]), {
  extends: [
    ...nextCoreWebVitals,
    ...compat.extends("plugin:react/recommended"),
    ...compat.extends("plugin:jsx-a11y/recommended"),
    ...compat.extends("prettier")
  ],

  plugins: {
    react,
    "jsx-a11y": jsxA11Y,
    react,
    "@typescript-eslint": typescriptEslint,
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.jest,
    },

    parser: tsParser,
    ecmaVersion: 5,
    sourceType: "commonjs",

    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },

  settings: {
    react: {
      version: "detect",
    },
  },

  rules: {
    "react/react-in-jsx-scope": "off",
    "default-case": "error",
    eqeqeq: "error",
    "id-match": "error",
    "no-console": "error",
    "no-param-reassign": "error",
    "prefer-const": "error",
    yoda: "error",

    "@typescript-eslint/array-type": ["error", {
      default: "array",
    }],

    "@typescript-eslint/naming-convention": ["error", {
      leadingUnderscore: "allow",
      selector: "variable",
      format: ["camelCase", "PascalCase", "UPPER_CASE"],
    }],

    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
    }],

    "@typescript-eslint/no-var-requires": "error",
    "react-hooks/exhaustive-deps": "off",
    "react/jsx-curly-brace-presence": "error",
    "react/jsx-sort-props": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/no-extraneous-dependencies": "error",
    "import/no-mutable-exports": "error",

    "import/no-restricted-paths": ["error", {
      zones: [{
        target: "download_data_source",
        from: "src",
        message: "L'application est fermée au download_data_source.",
      }, {
        target: "src",
        from: "download_data_source",
        message: "Le download_data_source est fermé à l'application.",
      }],
    }],

    "import/order": ["warn", {
      groups: [
        ["builtin", "external"],
        ["internal", "parent", "sibling", "index", "object", "type"],
      ],

      "newlines-between": "always",

      alphabetize: {
        order: "asc",
        caseInsensitive: true,
      },
    }],
  },
}, {
  files: ["**/*.test.ts?(x)"],
  extends: [
    ...compat.extends("plugin:jest/all"),
    ...compat.extends("plugin:jest-formatting/recommended")
  ],

  rules: {
    "jest/no-conditional-expect": "off",
    "jest/no-hooks": "off",
    "jest/require-hook": "off",
    "jest/prefer-expect-assertions": "off",

    "jest/prefer-lowercase-title": ["error", {
      ignore: ["describe"],
    }],

    "jest/prefer-strict-equal": "off",

    "jest/max-expects": ["warn", {
      max: 10,
    }],
  },
}, {
  files: ["**/*.test.tsx"],
  extends: [...compat.extends("plugin:testing-library/react")],
}]);
