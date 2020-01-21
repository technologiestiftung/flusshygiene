import { IApiResponse, ISpot } from "./../common/interfaces";
import { getSpots } from "../requests/get-data";
import nock from "nock";
const URL = "http://foo.com";
const user = { id: 1, email: "foo@bah.com" };

const spot: ISpot = {
  id: 1,
  apiEndpoints: { measurementsUrl: "http:/boom.xyz" },
  purificationPlants: [],
  genericInputs: [],
};

jest.mock("../common/env", () => {
  return {
    API_URL: "http://foo.com",
    getApiToken: jest.fn(() => {
      return "Bearer xyz";
    }),
  };
});
jest.mock("../utils/got", () => {
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
    const collection = await getSpots(users);
    expect(collection).toBeDefined();
    expect(collection.users).toBeDefined();
    expect(collection.users[0].spots[0]).toStrictEqual(spot);
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

    const collection = await getSpots(users);
    expect(collection.users.length).toBe(0);
    done();
  });
});
