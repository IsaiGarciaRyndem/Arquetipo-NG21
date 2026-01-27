import type { Config } from 'jest';

const preset = require('./jest.preset.js');
module.exports = {
  ...preset,
  moduleNameMapper: {
    ...preset.moduleNameMapper,
    '^lottie-web$': '<rootDir>/mocks/jest-lottie-mock.js',
  },
};
