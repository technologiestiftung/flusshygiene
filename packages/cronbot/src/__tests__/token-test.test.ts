import { testToken } from "./../auth/token";
import nock from "nock";
import { API_URL } from "../common/env";
// const spot: Spot = {
//   spotId: 1,
//   spotName: "foo",
//   userId: 1,
//   email: "foo@bah.com",
//   apiEndpoints: {},
// };

nock(API_URL)
  .persist()
  .get(/.*?/)
  .reply(200, {});
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

describe("test-token", () => {
  test("testing token validation", async (done) => {
    await expect(testToken("Bearer xyz")).resolves.toBe(true);

    done();
  });
});
