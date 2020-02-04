import { IEndpoints, IGeneric } from "./../common/interfaces";
import { DB, Schema } from "../lib/DB";

const db = DB.getInstance();
beforeEach(() => {
  db.resetState();
});
describe("DB", () => {
  test("db type", () => {
    expect(db).toBeInstanceOf(DB);
  });

  test("getReportsSorted", async (done) => {
    db.addReports({
      id: "foo",
      email: "foo@bah.com",
      type: "dataget",
      message: "foo",
      source: {} as IGeneric,
      stack: "",
      specifics: "",
    });
    db.addReports({
      id: "foo",
      email: "foo@bah.com",
      type: "admin",
      message: "foo",
      source: {} as IGeneric,
      stack: "",
      specifics: "",
    });
    db.addReports({
      id: "foo",
      email: "foo@bah.com",
      type: "dataget",
      message: "foo",
      source: {} as IGeneric,
      stack: "",
      specifics: "",
    });
    db.addReports({
      id: "foo",
      email: "boo@boo.com",
      type: "dataparse",
      message: "foo",
      source: {} as IGeneric,
      stack: "",
      specifics: "",
    });
    // const reports = db.getReportsSorted();
    // console.log(reports);
    done();
  });

  test("getReports/addReports", async (done) => {
    db.addReports({
      id: "foo",
      email: "foo@bah.com",
      type: "admin",
      message: "foo",
      source: {} as IGeneric,
      stack: "",
      specifics: "",
    });
    expect(db.getReports().length).toBe(1);
    done();
  });
  test("getEndpoints/addEndpoints", async (done) => {
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
      reports: [],
      spots: [],
    });
    done();
  });
});
