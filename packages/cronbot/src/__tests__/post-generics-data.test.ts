import { postGenerics } from "../lib/requests/post-data";
import { IGeneric } from "../common/interfaces";
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
const data: IGeneric[] = [
  {
    id: "foo",
    spot: { id: 1, name: "foo" },
    user: { id: 1, email: "foo@bah.com" },
    pgId: 1,
    type: "Generische Werte",
    name: "foo",
    url: "",
    comment: "cronbot",
    data: [{ date: "2020-01-10", value: 1 }],
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
    API_URL: "http://foo.com",
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
        url: `${API_URL}/users/1/bathingspots/1/genericInputs/1/measurements`,
      };
    },
  };
});

describe("postGenerics data should resolve fine", () => {
  test("", async (done) => {
    const scope = nock(API_URL)
      .post(
        `/users/${spot.userId}/bathingspots/${spot.spotId}/genericInputs/1/measurements`,
      )
      .reply(201, {
        data: [{ id: 1 }],
      });

    await expect(postGenerics("genericInputs", data)).resolves.toBe(undefined);
    // await postGenerics("genericInputs", data);
    scope.persist(false);
    done();
  });
  test("should throw an error", async (done) => {
    nock(API_URL)
      .post(
        `/users/${spot.userId}/bathingspots/${spot.spotId}/genericInputs/1/measurements`,
      )
      .reply(500);
    const mockConsoleErr = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn);

    await expect(postGenerics("genericInputs", data)).rejects.toThrow();
    mockConsoleErr.mockRestore();

    done();
  });
});
