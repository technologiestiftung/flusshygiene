/**
 * See https://github.com/facebook/jest/issues/5538#issuecomment-461013424
 * about the thorw stuff
 *
 */
const OLD_ENV = process.env;
afterAll(() => {
  process.env = { ...OLD_ENV };
});

beforeEach(() => {
  jest.resetModules();
});
afterEach(() => {
  process.env = { ...OLD_ENV };
});
beforeAll(() => {
  // delete process.env.API_VERSION;
  // delete process.env.API_URL;
});
describe("Environment variables", () => {
  test("module should have defined constants values", async () => {
    import("../common/env").then((module) => {
      expect(module.API_HOST).toBeDefined();
      expect(typeof module.API_HOST).toBe("string");
      expect(module.API_URL).toBeDefined();
      expect(typeof module.API_URL).toBe("string");
      expect(module.API_VERSION).toBeDefined();
      expect(typeof module.API_VERSION).toBe("string");
      expect(module.AUTH0_AUDIENCE).toBeDefined();
      expect(typeof module.AUTH0_AUDIENCE).toBe("string");
      expect(module.AUTH0_CLIENT_ID).toBeDefined();
      expect(typeof module.AUTH0_CLIENT_ID).toBe("string");
      expect(module.AUTH0_CLIENT_SECRET).toBeDefined();
      expect(typeof module.AUTH0_CLIENT_SECRET).toBe("string");
      expect(module.AUTH0_TOKEN_ISSUER).toBeDefined();
      expect(typeof module.AUTH0_TOKEN_ISSUER).toBe("string");
    });
  });

  test("module should throw error due to missing API_HOST", async () => {
    // process
    delete process.env.API_HOST;

    await expect(import("../common/env")).rejects.toThrow();
  });
  test("module should throw error due to missing API_VERSION", async () => {
    delete process.env.API_VERSION;

    await expect(import("../common/env")).rejects.toThrow();
  });
  test("module should throw error due to missing AUTH0_AUDIENCE", async () => {
    // process

    delete process.env.AUTH0_AUDIENCE;

    await expect(import("../common/env")).rejects.toThrow();
  });
  test("module should throw error due to missing AUTH0_CLIENT_ID", async () => {
    // process

    delete process.env.AUTH0_CLIENT_ID;

    await expect(import("../common/env")).rejects.toThrow();
  });
  test("module should throw error due to missing AUTH0_CLIENT_SECRET", async () => {
    // process

    delete process.env.AUTH0_CLIENT_SECRET;
    await expect(import("../common/env")).rejects.toThrow();
  });
  test("module should throw error due to missing AUTH0_TOKEN_ISSUER", async () => {
    // process

    delete process.env.AUTH0_TOKEN_ISSUER;
    await expect(import("../common/env")).rejects.toThrow();
  });

  test("module should throw error due to missing api url containing undefined", async () => {
    // process

    process.env.API_HOST = "undefined";
    process.env.API_VERSION = "undefined";
    await expect(import("../common/env")).rejects.toThrow();
  });
});
