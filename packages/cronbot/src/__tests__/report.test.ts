import { IBuildReport, Spot } from "./../common/interfaces";

import { buildReport } from "./../lib/report";
describe("Sending out reports", () => {
  test("buildReport", () => {
    const source: IBuildReport = {
      id: "",
      email: "",
      type: "admin",
      message: "foo",
      stack: "",
      source: {} as Spot,
    };
    const res = buildReport(source);
    expect(res).toStrictEqual(source);
  });
});
