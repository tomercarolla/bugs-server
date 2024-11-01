import { FlatCompat } from "@eslint/eslintrc";
import { default as js, default as pluginJs } from "@eslint/js";
import prettier from "eslint-plugin-prettier";
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
    ignores: ["**/node_modules/", "**/dist/", "**/build/", "**/public/"],
  },
  ...compat.extends("eslint:recommended", "plugin:prettier/recommended"),
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
      },
    },
    rules: {
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
    plugins: {
      prettier,
    },
  },
  pluginJs.configs.recommended,
];
