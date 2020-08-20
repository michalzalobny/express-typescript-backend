module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
        semi: false,
        trailingComma: 'es5',
        printWidth: 140,
      },
    ],
  },
}
