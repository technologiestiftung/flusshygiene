import { getSpots } from "./../lib/requests/get-spots";
import { IApiResponse } from "./../common/interfaces";
import nock from "nock";
const URL = "http://foo.com";
const user = { id: 1, email: "foo@bah.com" };
import { DB } from "../lib/DB";
const db = DB.getInstance();
const spot = {
  id: 1,
  name: "foo",
  apiEndpoints: { measurementsUrl: "http:/boom.xyz" },
  // purificationPlants: [],
  // genericInputs: [],
};

jest.mock("../common/env", () => {
  return {
    API_URL: "http://foo.com",
    getApiToken: jest.fn(() => {
      return "Bearer xyz";
    }),
  };
});
jest.mock("../utils/got-util", () => {
  return {
    gotOptionsFactory: jest.fn(() => {
      return { url: `${URL}/users/1/bathingspots` };
    }),
  };
});

describe("getting spots", () => {
  test("get all existing spots", async () => {
    nock(URL)
      // .log(console.log)
      .get("/users/1/bathingspots")
      .reply(200, {
        data: [spot],
        success: true,
        apiVersion: "0.0.0",
      });
    const users: IApiResponse = { data: [user], success: true, apiVersion: "" };
    // await getSpots(users);
    await expect(getSpots(users)).resolves.toBe(undefined);
    // expect(spots).toBeDefined();
    // expect(spots[0].spotId).toStrictEqual(spot.id);
    // expect(spots[0].spotName).toStrictEqual(spot.name);
    // expect(spots.users).toBeDefined();
    // expect(collection.users[0].spots[0]).toStrictEqual(spot);
  });

  test("User without spots will be removed", async (done) => {
    nock(URL)
      // .log(console.log)
      .get("/users/1/bathingspots")
      .reply(200, {
        data: [],
        success: true,
        apiVersion: "0.0.0",
      });
    const users: IApiResponse = {
      data: [user],
      success: true,
      apiVersion: "",
    };

    await getSpots(users);
    const spots = db.getSpots();
    expect(spots.length).toBe(0);
    done();
  });
});
