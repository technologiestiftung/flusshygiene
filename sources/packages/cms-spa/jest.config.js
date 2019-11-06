module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.jest.json',
      diagnostics: false,
    },
  },
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: 'src/__tests__/.*\\.(test|spec)?\\.(ts|tsx)$',
  globalSetup: '<rootDir>src/setupTests.ts',
  // globalTeardown: '<rootDir>src/__tests__/jest.teardown.ts',
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!__test-utils/**',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!src/setup/**',
    '!src/react-auth0-wrapper.tsx',
    '!src/serviceWorker.ts',
    '!src/stories/**',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  preset: 'ts-jest/presets/js-with-babel',
  testMatch: null,
  modulePaths: ['<rootDir>'],
};
