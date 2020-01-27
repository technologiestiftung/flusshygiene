import { IEndpoints, IGeneric } from "./../common/interfaces";
import { DB, Schema } from "../lib/DB";
// import nock from "nock";
// import { Spot } from "../common/interfaces";

// const spot: Spot = {
//   spotId: 1,
//   spotName: "foo",
//   userId: 1,
//   email: "foo@bah.com",
//   apiEndpoints: {},
// };
// const CRON_URL = "https://cronbot-sources.now.sh";
// const API_URL = "https://www.flusshygiene.xyz";
// nock(API_URL)
//   .persist()
//   .get(`/users/${spot.userId}/bathingspots/${spot.spotId}/genericInputs`)
//   .reply(200, {
//     data: [{ id: 1, url: `${CRON_URL}?count=10`, name: "foo" }],
//   });

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

describe("DB", () => {
  test("getEndpoints/addEndpoints", async (done) => {
    const db = DB.getInstance();
    expect(db).toBeInstanceOf(DB);
    expect(db.getEndpoints).toBeDefined();
    expect(db.getEndpoints()).toStrictEqual<IEndpoints[]>([]);
    const data: IEndpoints[] = [
      {
        id: "foo",
        user: { id: 1, email: "foo@bah.com" },
        spot: { id: 1, name: "foo" },
        discharges: [],
        measurements: [],
        globalIrradiances: [],
      },
    ];
    db.addEndpoints(data);
    expect(db.getEndpoints()[0]).toStrictEqual(data[0]);
    done();
  });

  test("getGenerics/addGenerics", async (done) => {
    const db = DB.getInstance();
    expect(db).toBeInstanceOf(DB);
    expect(db.getGenerics("genericInputs")).toStrictEqual([]);
    const data: IGeneric[] = [
      {
        id: "foo",
        user: { id: 1, email: "foo@bah.com" },
        spot: { id: 1, name: "foo" },
        pgId: 1,
        name: "foo",
        type: "Generische Werte",
        data: [{ date: "2020-10-10", value: 1 }],
      },
    ];
    db.addGenerics("genericInputs", data);
    expect(db.getGenerics("genericInputs")[0]).toStrictEqual(data[0]);
    db.resetState();
    // console.log(db.getState());
    expect(db.getState()).toStrictEqual<Schema>({
      endpoints: [],
      genericInputs: [],
      purificationPlants: [],
      errors: [],
    });
    done();
  });
});
