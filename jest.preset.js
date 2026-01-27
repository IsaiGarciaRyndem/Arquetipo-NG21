module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/*.spec.ts'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/src/app/$1',
  },
};
