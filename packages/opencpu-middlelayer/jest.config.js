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
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.after-env.ts'],
  testRegex: '/src/__tests__/.*\\.(test|spec)?\\.(ts|tsx)$',
  globalSetup: '<rootDir>/src/__tests__/jest.setup.ts',
  globalTeardown: '<rootDir>/src/__tests__/jest.teardown.ts',
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/app.ts',
    '!src/index.ts',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/coverage/**',
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
};
