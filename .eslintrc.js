module.exports = {
  "extends": ["airbnb-base", "plugin:jest/recommended", "plugin:compat/recommended"],
  "parserOptions": {
    "ecmaVersion": 6
  },
  "env": {
    "browser": true,
    "es6": true,
    "jest": true
  },
  "rules": {
    "comma-dangle": ["error", "never"],
    "no-param-reassign": ["error", { "props": false }]
  }
};