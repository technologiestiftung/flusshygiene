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
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.after-env.ts'],
  testRegex: '/__tests__/.*\\.(test|spec)?\\.(ts|tsx)$',
  globalSetup: '<rootDir>/__tests__/jest.setup.ts',
  globalTeardown: '<rootDir>/__tests__/jest.teardown.ts',
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
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  preset: 'ts-jest/presets/js-with-babel',
  testMatch: null,
};
