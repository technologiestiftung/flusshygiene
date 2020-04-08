import { buildReq, buildRes, buildNext } from "./utlis/factories";

// jest.mock("jwks-rsa");

describe("auth module calls", () => {
  // eslint-disable-next-line jest/expect-expect
  test("call to auth", async () => {
    const processOrig = process.env;
    process.env.JWKS_URI = "http://example.com";
    process.env.AUTH0_AUDIENCE = "";
    process.env.AUTH0_ISSUER = "";
    const module = await import("../lib/auth");
    const req = buildReq();
    const res = buildRes();
    const next = buildNext();
    expect(() => {
      module.checkJwt(req, res, next);
    }).not.toThrow();
    process.env = processOrig;
  });
  // test("call to auth throws", async () => {

  //   const module = await import("../lib/auth");
  //   const req = buildReq();
  //   const res = buildRes();
  //   const next = buildNext();
  //   expect(() => {
  //     module.checkJwt(req, res, next);
  //   }).toThrow();
  // });
});
