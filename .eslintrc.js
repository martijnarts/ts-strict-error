module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:eslint-comments/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:promise/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: [
    "prettier",
    "@typescript-eslint",
    "import",
    "promise",
    "eslint-plugin-tsdoc",
  ],
  rules: {
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "eslint-comments/require-description": "error",
    "tsdoc/syntax": "warn",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
      project: "./tsconfig.json",
    },
  },
};
