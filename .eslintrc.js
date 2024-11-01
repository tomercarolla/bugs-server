module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  globals: {
    process: "readonly",
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    warnOnUnsupportedTypeScriptVersion: false,
  },
  ignorePatterns: ["node_modules/"],
  rules: {
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-unused-vars": "warn",
    "no-undef": "warn",
  },
};
