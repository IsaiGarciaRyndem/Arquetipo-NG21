/** @type {import("stylelint").Config} */
export default {
  "plugins": ["stylelint-order"],
  "extends": ["stylelint-config-standard", "stylelint-config-standard-scss", "stylelint-config-alphabetical-order"],
  "rules": {},
  "ignoreFiles": ['dist/**', 'node_modules/**', '.husky/**', '.idea/**', '.angular/**'],
};
