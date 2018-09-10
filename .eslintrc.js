module.exports = {
  "extends": ["airbnb-base", "plugin:jest/recommended"],
  "parserOptions": {
    "ecmaVersion": 6
  },
  "env": {
    "browser": true,
    "es6": true,
    "jest": true
  },
  "plugins": ["jest"],
  "rules": {
    "comma-dangle": ["error", "never"]
  }
};