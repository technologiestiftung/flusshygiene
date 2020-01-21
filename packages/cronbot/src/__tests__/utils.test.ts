import * as dep from "./../common/env";
import { gotOptionsFactory } from "../utils/got";

// beforeAll(() => {
//   process.env.API_URL = "http://foo.com";
// });
jest.mock("../common/env");

describe.skip("utils", () => {
  test("got function factory", async (done) => {
    const opts = await gotOptionsFactory();
    const token = dep.getApiToken();
    // expect(opts.url).toBe(API_URL);
    expect(opts.headers).toStrictEqual({ authorization: token });
    done();
  });
});
