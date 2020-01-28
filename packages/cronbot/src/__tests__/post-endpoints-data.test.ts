import { IEndpoints } from "../../dist/common/interfaces";
import { postApiEndpoints } from "../lib/requests/post-data";
// import { IGeneric } from "../common/interfaces";
import nock from "nock";
import { Spot } from "../common/interfaces";
// const CRON_URL = "https://cronbot-sources.now.sh";
const API_URL = "https://www.flusshygiene.xyz";
const spot: Spot = {
  spotId: 1,
  spotName: "foo",
  userId: 1,
  email: "foo@bah.com",
  apiEndpoints: {},
};
const data: IEndpoints[] = [
  {
    id: "",
    measurements: [{ date: "2020-01-10", conc_ec: 1, conc_ie: 1 }],
    discharges: [{ date: "2020-01-10", value: 1 }],
    globalIrradiances: [{ date: "2020-01-10", value: 1 }],
    user: { id: spot.userId, email: spot.email },
    spot: { id: spot.spotId, name: spot.spotName },
  },
];

// nock(API_URL)
//   .persist()
//   .post(
//     `/users/${spot.userId}/bathingspots/${spot.spotId}/genericInputs/1/measurements`,
//   )
//   .reply(201, {
//     data: [{ id: 1 }],
//   });

jest.mock("../common/env", () => {
  return {
    API_URL: "https://www.flusshygiene.xyz",
    getApiToken: jest.fn(() => {
      return "Bearer xyz";
    }),
  };
});
jest.mock("lowdb");

jest.mock("../utils/got-util", () => {
  return {
    gotOptionsFactory: () => {
      return {
        url: `${API_URL}/users/1/bathingspots/1/measurements`,
      };
    },
  };
});

describe("postGenerics data should resolve fine", () => {
  test("postApiEndpoitsData", async (done) => {
    const scope = nock(API_URL)
      // .log(console.log)
      .persist()
      .post(
        /users\/\d{1,3}\/bathingspots\/\d{1,3}\/[measurements|discharges|globalIrradiances]/i,
      )
      .reply(201, {
        data: [{ id: 1 }],
      });

    await expect(postApiEndpoints(data)).resolves.toBe(true);
    scope.persist(false);
    done();
  });
  test("errors", async (done) => {
    const mockConsoleErr = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn);

    nock(API_URL)
      // .log(console.log)
      .persist()
      .post(
        /users\/\d{1,3}\/bathingspots\/\d{1,3}\/[measurements|discharges|globalIrradiances]/i,
      )
      .reply(500, "err");
    await expect(postApiEndpoints(data)).rejects.toThrow();
    mockConsoleErr.mockRestore();
    done();
  });
});
