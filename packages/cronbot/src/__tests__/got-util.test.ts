import { gotOptionsFactory } from "../utils/got-util";
jest.mock("../common/env", () => {
  return {
    API_URL: "http://foo.com",
    getApiToken: jest.fn(() => {
      return "Bearer xyz";
    }),
  };
});
// jest.mock("../utils/got", () => {
//   return {
//     gotOptionsFactory: jest.fn(() => {
//       return { url: `${URL}/users/1/bathingspots` };
//     }),
//   };
// });

describe.skip("got-util", () => {
  test("testing the got utility", async (done) => {
    const opts = await gotOptionsFactory();
    expect(opts.url).toBeDefined();
    done();
  });
});
