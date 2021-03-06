module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    Vue: 'writable',
    wp_data: 'writable',
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'max-len': ["error", { "code": 200 }],
    'no-param-reassign': ["error", { "props": false }],
    "prefer-destructuring": ["error", {"object": true, "array": false}]
  },
};
