import { testToken } from "./../auth/token";
import mock from "mock-fs";
import { getFromDisk } from "../auth/token";

mock({
  "./test": {
    ".token": "Bearer xyz",
  },
});

afterAll(() => {
  mock.restore();
});

let TOKEN: string | undefined;

describe("Getting tokens", () => {
  test("reading from disk", async (done) => {
    await expect(getFromDisk()).resolves.toBe(undefined);
    await expect(getFromDisk("./test/.token")).resolves.toBe("Bearer xyz");
    done();
  });

  test.skip("tesToken call to api", async (done) => {
    const res = await testToken("Bearer xyz");
    expect(res).toBe(true);
    done();
  });

  test.skip("token process env should exist", () => {
    expect(TOKEN).toBeDefined();
  });
});
