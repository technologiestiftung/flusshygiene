module.exports = {
  roots: ["<rootDir>/src"],
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
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/src/__jest__/jest.setup.after-env.ts"],
  testRegex: "/__tests__/.*\\.(test|spec)?\\.(ts|tsx)$",
  // globalSetup: "<rootDir>/src/__tests__/jest.setup.ts",
  // globalTeardown: '<rootDir>/__tests__/jest.teardown.ts',
  moduleFileExtensions: ["js", "json", "jsx", "node", "ts", "tsx"],
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/__jest__/**/*",
    "!src/__mocks__/**/*",
    "!src/cli.ts",
    "!src/index.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  preset: "ts-jest",
  testMatch: null,
};