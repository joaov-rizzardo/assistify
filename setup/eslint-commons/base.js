module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:jest/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'prettier'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
    'jest/globals': true
  },
  rules: {
    'jest/no-deprecated-functions': 'off',
    'import/prefer-default-export': 'off',
    'jest/no-conditional-expect': 'off'
  }
};
