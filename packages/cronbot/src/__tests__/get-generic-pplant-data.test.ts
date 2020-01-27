import { getGenericData } from "./../lib/requests/get-generic-pplant-data";
import { getData } from "./../__utils__/build-cronbot-source-data";
import nock from "nock";
import { DB } from "../lib/DB";
import { Spot } from "../common/interfaces";
const CRON_URL = "https://cronbot-sources.now.sh";
const API_URL = "https://www.flusshygiene.xyz";
// https://cronbot-sources.now.sh/?count=10&type=conc
const spot: Spot = {
  spotId: 1,
  spotName: "foo",
  userId: 1,
  email: "foo@bah.com",
  apiEndpoints: {},
};
jest.mock("../common/env", () => {
  return {
    API_URL: "https://www.flusshygiene.xyz",
    getApiToken: jest.fn(() => {
      return "Bearer xyz";
    }),
  };
});
jest.mock("../utils/got-util", () => {
  return {
    gotOptionsFactory: jest.fn(() => {
      return {
        url: `${API_URL}/users/${spot.userId}/bathingspots/${spot.spotId}/genericInputs`,
      };
    }),
  };
});

nock(API_URL)
  .persist()
  .get(`/users/${spot.userId}/bathingspots/${spot.spotId}/genericInputs`)
  .reply(200, {
    data: [{ id: 1, url: `${CRON_URL}?count=10`, name: "foo" }],
  });
describe("get-generic-pplant-data", () => {
  const responseData: { date: string; value: number }[] = getData(10);
  // console.log(data);
  test("should make all calls and write to the DB", async (done) => {
    nock(CRON_URL)
      .get("/?count=10")
      .reply(200, { data: responseData });

    await getGenericData("genericInputs", [spot]);
    const db = DB.getInstance();
    const generics = db.getGenerics("genericInputs");
    expect(generics[0].data).toMatchObject(responseData);
    done();
  });

  test("should throw an error due to non parsable data from the cron urls", async (done) => {
    const mockConsoleErr = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn);
    nock(CRON_URL)
      .get("/?count=10")
      .reply(200, "err");
    await expect(getGenericData("genericInputs", [spot])).rejects.toThrow();
    mockConsoleErr.mockRestore();

    done();
  });
});
