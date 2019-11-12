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
    '!src/index.ts',
    '!src/lib/app.ts',
    '!src/lib/server.ts',
    '!src/lib/old/**/*.ts',
    '!src/orm/**/*.ts',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/coverage/**',
    '!src/setup/**',
    '!src/lib/middleware/user-spot-check.ts',
    '!src/playground/**',
  ],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  preset: 'ts-jest/presets/js-with-babel',
  testMatch: null,
};
