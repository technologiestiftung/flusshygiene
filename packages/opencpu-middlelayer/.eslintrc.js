// {
//   "extends": ["plugin:prettier/recommended"],
//   "parser": "@typescript-eslint/parser",
//   "plugins": ["@typescript-eslint", "prettier"],
//   "rules": {
//     "prettier/prettier": "error"
//   }
// }

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
