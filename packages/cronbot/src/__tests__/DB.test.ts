import { IObject, IReport } from "./../../dist/common/interfaces.d";
import { IEndpoints, IGeneric } from "./../common/interfaces";
import { DB } from "../lib/DB";

const buildTestReport: (overrides?: IObject) => IReport = (overrides) => {
  const report: IReport = {
    id: "foo",
    email: "foo@bah.com",
    type: "admin",
    message: "foo",
    source: {} as IGeneric,
    stack: "",
    specifics: "",
    ...overrides,
  };
  return report;
};
const db = DB.getInstance();
// beforeAll(() => {});
beforeEach(() => {
  db.resetState();
});
afterEach(() => {
  db.resetState();
  jest.resetModules();
});
describe("DB", () => {
  test.skip("layout use for new tests", () => {
    import("../lib/DB").then((module) => {
      const db = module.DB.getInstance();
    });
  });

  test("db type", () => {
    import("../lib/DB")
      .then((module) => {
        const db = module.DB.getInstance();
        expect(db).toBeInstanceOf(module.DB);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  test("getReportsSorted", () => {
    import("../lib/DB")
      .then((module) => {
        const db = module.DB.getInstance();
        db.addReports(
          buildTestReport({ type: "dataget", email: "foo@bah.com" }),
        );
        db.addReports(
          buildTestReport({ type: "dataget", email: "foo@bah.de" }),
        );
        db.addReports(
          buildTestReport({ type: "dataget", email: "foo@bah.xyz" }),
        );

        const reports = db.getReportsSorted();
        expect(reports.length).toBe(3);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  test("getReports/addReports", () => {
    import("../lib/DB")
      .then((module) => {
        const db = module.DB.getInstance();
        db.addReports({
          id: "foo",
          email: "foo@bah.com",
          type: "admin",
          message: "foo",
          source: {} as IGeneric,
          stack: "",
          specifics: "",
        });
        // console.log(db.getReports());
        expect(db.getReports().length).toBe(1);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  test("getReports/addReports", () => {
    import("../lib/DB")
      .then((module) => {
        const db = module.DB.getInstance();
        db.addReports([buildTestReport(), buildTestReport()]);
        expect(db.getReports().length).toBe(2);
      })
      .catch((err) => {
        console.error(err);
      });
  });
  test("getEndpoints/addEndpoints", () => {
    import("../lib/DB")
      .then((module) => {
        const db = module.DB.getInstance();
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
      })
      .catch((err) => {
        console.error(err);
      });
  });
  test("getEndpoints/addEndpoints", () => {
    import("../lib/DB")
      .then((module) => {
        const db = module.DB.getInstance();
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
        db.addEndpoints(data[0]);
        expect(db.getEndpoints()[0]).toStrictEqual(data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  test("getGenerics/addGenerics", () => {
    import("../lib/DB")
      .then((module) => {
        const db = module.DB.getInstance();
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
      })
      .catch((err) => {
        console.error(err);
      });
  });
  test("addGenerics", () => {
    import("../lib/DB")
      .then((module) => {
        const db = module.DB.getInstance();
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
        db.addGenerics("genericInputs", data[0]);
        expect(db.getGenerics("genericInputs")[0]).toStrictEqual(data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  });
  test("updateSpot", () => {
    import("../lib/DB")
      .then((module) => {
        const db = module.DB.getInstance();
        const sourceSpot = {
          spotId: 1,
          userId: 1,
          spotName: "foo",
          email: "foo@bah.com",
          apiEndpoints: {},
        };
        db.setSpots([sourceSpot]);
        let spots = db.getSpots();
        expect(spots).toEqual([sourceSpot]);
        db.updateSpot(spots[0].spotId, true);
        spots = db.getSpots();
        expect(spots[0].hasModel).toBe(true);
      })
      .catch((err) => {
        console.error(err);
      });
  });
});
