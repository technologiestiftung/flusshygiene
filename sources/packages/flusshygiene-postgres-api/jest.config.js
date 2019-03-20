module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "./tsconfig.jest.json",
      diagnostics: false,
    },
  },
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testEnvironment: "node",
  testRegex: "/__tests__/.*\\.(test|spec)?\\.(ts|tsx)$",
  globalSetup: "<rootDir>/__tests__/jest.setup.ts",
  globalTeardown: "<rootDir>/__tests__/jest.teardown.ts",
  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "node",
    "ts",
    "tsx",
  ],
  collectCoverage: true,
  coverageReporters: [
    "lcov",
    "text",
    "text",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/index.ts",
    "!src/lib/app.ts",
    "!src/lib/server.ts",
    "!src/lib/old/**/*.ts",
    "!src/orm/**/*.ts",
    "!**/node_modules/**",
    "!**/build/**",
    "!**/coverage/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  preset: "ts-jest/presets/js-with-babel",
  testMatch: null,
};
