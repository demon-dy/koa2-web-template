module.exports = {
  "parser": "babel-eslint",
  "env": {
    "node": true,
    "es6": true,
    "commonjs": true,
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {
      "legacyDecorators": true
    }
  },
  "rules": {
    "array-bracket-spacing": [2, "never"],
    "brace-style": [2, "1tbs", { "allowSingleLine": true }],
    "comma-spacing": [2, { "before": false, "after": true }],
    "no-console": 0,
    "no-empty": 0,
    'no-tabs': 0,
    "no-const-assign": 2,
    'no-mixed-spaces-and-tabs': 0,
    "indent": [
      "error",
      "tab",
      { "SwitchCase": 1 }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
  }
};