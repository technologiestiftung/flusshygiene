import { ReportType } from "./../common/types";
import { getApiEndpointsData } from "../lib/requests/get-api-endpoints-data";
import nock from "nock";

import { Spot } from "../common/interfaces";
import { getData } from "../__utils__/build-cronbot-source-data";
import { DB } from "../lib/DB";

const CRON_URL = "https://cronbot-sources.now.sh";
const API_URL = "https://www.flusshygiene.xyz";
const db = DB.getInstance();
const spot: Spot = {
  spotId: 1,
  spotName: "foo",
  userId: 1,
  email: "foo@bah.com",
  apiEndpoints: {
    measurementsUrl: `${CRON_URL}?type=conc&count=10`,
    globalIrradianceUrl: `${CRON_URL}?count=10`,
    dischargesUrl: `${CRON_URL}?count=10`,
  },
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
      return { url: `${URL}/users/${spot.userId}/bathingspots/${spot.spotId}` };
    }),
  };
});

nock(API_URL)
  .persist()
  .get(`/users/${spot.userId}/bathingspots/${spot.spotId}`)
  .reply(200, {
    data: [
      {
        id: 1,
        url: `${CRON_URL}?count=10`,
        name: "foo",
        apiEndpoints: spot.apiEndpoints,
      },
    ],
  });

beforeEach(() => {
  db.resetState();
});
describe("get-api-endpoints-data", () => {
  test.skip("foobah", async (done) => {
    const responseData: { date: string; value: number }[] = getData(10);

    const responseDataConc: { date: string; value: number }[] = getData(
      10,
      "conc",
    );
    nock(CRON_URL)
      .persist()
      .get("/?count=10")
      .reply(200, { data: responseData });
    nock(CRON_URL)
      .get("/?type=conc&count=10")
      .reply(200, { data: responseDataConc });
    await getApiEndpointsData();
    const apiEndpoints = db.getEndpoints();
    expect(apiEndpoints[0].discharges).toMatchObject(responseData);
    done();
  });

  test.skip("should create report due to unparsable data", async (done) => {
    const mockConsoleErr = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn);
    nock(CRON_URL)
      .get("/?type=conc&count=10")
      .reply(200, "ERROR");
    await expect(getApiEndpointsData()).resolves.toBe(undefined);
    const reports = db.getReports();
    expect(reports.length).toBeGreaterThan(0);
    expect(reports[0].type).toBe<ReportType>("dataparse");
    mockConsoleErr.mockRestore();

    done();
  });
});
