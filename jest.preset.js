module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/*.spec.ts'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^@appCore/(.*)$': '<rootDir>/src/app/core/$1',
    '^@appShared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@appStore/(.*)$': '<rootDir>/src/app/store/$1',
    '^@appFeatures/(.*)$': '<rootDir>/src/app/features/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },
};
