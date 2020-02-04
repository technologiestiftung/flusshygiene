import { IGeneric, IMeasurement } from "./../common/interfaces";
import { ReportType, GenericType } from "./../common/types";
import { getGenericData } from "./../lib/requests/get-generic-pplant-data";
import { getData } from "./../__utils__/build-cronbot-source-data";
import nock from "nock";
import { DB } from "../lib/DB";
import { Spot } from "../common/interfaces";
const CRON_URL = "https://cronbot-sources.now.sh";
const API_URL = "https://www.flusshygiene.xyz";
const db = DB.getInstance();
const reg = /\/users\/\d{1,3}\/bathingspots\/\d{1,3}\/[genericInputs|purificationPlants]/;
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

afterEach(() => {
  db.resetState();
});

const responseData: { date: string; value: number }[] = getData(10);
describe("get-generic-pplant-data", () => {
  // console.log(data);
  test.skip("should make all calls and write to the DB", async (done) => {
    nock(API_URL)
      .get(reg)
      .reply(200, {
        data: [{ id: 1, url: `${CRON_URL}?count=10`, name: "foo" }],
      });

    nock(CRON_URL)
      .get("/?count=10")
      .reply(200, { data: responseData });

    await getGenericData("genericInputs");
    // const db = DB.getInstance();
    const generics = db.getGenerics("genericInputs");
    expect(generics[0].data).toMatchObject(responseData);
    done();
  });

  test("should get data and subitems", async (done) => {
    const type: GenericType = "genericInputs";
    // const spots: Spot[] = [
    //   {
    //     spotId: 1,
    //     userId: 1,
    //     spotName: "foo",
    //     email: "foo@bah.com",
    //     apiEndpoints: {},
    //   },
    // ];

    const res1: { name: string; id: number; url: string } = {
      id: 1,
      name: "gi",
      url: "https://cronbot-sources.now.sh?count=70",
    };
    const res2: { data: IMeasurement[] } = {
      data: [
        { date: "2020-10-10", value: 1 },
        { date: "2020-10-11", value: 1 },
      ],
    };
    const addReportSpy = jest.spyOn(db, "addReports");

    nock(API_URL)
      // .log(console.log)
      .get(reg)
      .reply(200, { data: [res1] });

    nock("https://cronbot-sources.now.sh")
      // .log(console.log)
      .get(/.*?/)
      // .query({ count: 70 })
      .reply(200, res2);

    await expect(getGenericData(type)).resolves.toBe(undefined);
    // const state = db.getState();
    // console.log(db.getReports()[0].stack);
    expect(addReportSpy).not.toHaveBeenCalled();
    done();
  });

  test.skip("should throw an error due to non parsable data from the cron urls", async (done) => {
    const reportSpy = jest.spyOn(db, "addReports");
    const mockConsoleErr = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn);

    nock(API_URL)
      .get(reg)
      .reply(200, {
        data: [{ id: 1, url: `${CRON_URL}?count=10`, name: "foo" }],
      });
    nock(CRON_URL)
      .get(/.*?/)
      .reply(200, "err");

    await expect(getGenericData("genericInputs")).resolves.toBe(undefined);

    const reports = db.getReports();
    expect(reports.length).toBeGreaterThan(0);
    expect(reports[0].type).toBe<ReportType>("dataparse");
    expect((reports[0].source as IGeneric).spot.id).toBe(spot.spotId);
    expect(reportSpy).toHaveBeenCalled();

    mockConsoleErr.mockRestore();

    done();
  });
});
