module.exports = {
  env: {
    browser: true,
    es2021: true,
    mocha: true,
    node: true,
  },
  extends: [
    'dherault',
  ],
  parser: 'babel-eslint',
  overrides: [
    {
      files: ['hardhat.config.js'],
      globals: { task: true },
    },
  ],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'react/style-prop-object': 'off',
    'react/jsx-no-bind': 'off',
  },
}
