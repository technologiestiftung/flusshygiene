import nock from "nock";
// import { Spot } from "../common/interfaces";
import { AUTH0_TOKEN_ISSUER } from "../common/env";
import { getNewToken } from "../auth/token";
// const spot: Spot = {
//   spotId: 1,
//   spotName: "foo",
//   userId: 1,
//   email: "foo@bah.com",
//   apiEndpoints: {},
// };
// const CRON_URL = "https://cronbot-sources.now.sh";
// const API_URL = "https://www.flusshygiene.xyz";

nock(`${AUTH0_TOKEN_ISSUER}`)
  // .log(console.log)
  .persist()
  .post(/.*?/)
  .reply(201, {});

// jest.mock("../common/env", () => {
//   return {
//     API_URL: "http://foo.com",
//     getApiToken: jest.fn(() => {
//       return "Bearer xyz";
//     }),
//   };
// });
// jest.mock("../utils/got-util", () => {
//   return {
//     gotOptionsFactory: jest.fn(() => {
//       return { url: `${URL}/users/1/bathingspots` };
//     }),
//   };
// });

describe("get-new-token tests", () => {
  test.skip("", async (done) => {
    await expect(getNewToken()).resolves.toStrictEqual({});
    // const mockConsoleErr = jest.spyOn(console, "error");
    // test here
    // mockConsoleErr.mockRestore();

    done();
  });
});
