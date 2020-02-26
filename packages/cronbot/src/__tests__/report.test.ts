import { IObject } from "./../../dist/common/interfaces.d";
import { globals } from "./../common/globals";
import { IBuildReport, Spot, IReport } from "./../common/interfaces";

import { buildReport, sendReports, wrapInCodeTags } from "./../lib/report";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import nodemailer from "nodemailer";
import { DB } from "../lib/DB";
jest.useFakeTimers();
const db = DB.getInstance();
const buildTestReport: (overrides?: IObject) => IReport = (overrides) => {
  const report: IReport = {
    id: "1",
    email: "foo@bah.com",
    type: "dataget",
    message: "foo",
    source: {},
    specifics: "foo",
    ...overrides,
  };
  return report;
};
jest.mock("nodemailer", () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn(),
      close: jest.fn(),
      verify: jest.fn(),
    }),
  };
});
beforeAll(() => {
  process.env = Object.assign(process.env, {
    SMTP_HOST: "foo",
    SMTP_USER: "foo",
    SMTP_PW: "foo",
    SMTP_PORT: "foo",
    SMTP_FROM: "foo",
    SMTP_ADMIN_TO: "foo",
  });
});
afterAll(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("Sending out reports", () => {
  test("buildReport", () => {
    const source: IBuildReport = {
      id: "",
      email: "",
      type: "admin",
      message: "foo",
      stack: "",
      specifics: "",
      source: {} as Spot,
    };
    const res = buildReport(source);
    expect(res).toStrictEqual(source);
  });

  test("send reports admin only", async (done) => {
    await sendReports();
    const mockedTransport = nodemailer.createTransport();
    expect(nodemailer.createTransport).toHaveBeenCalledTimes(2);
    expect(mockedTransport.sendMail).toHaveBeenCalledTimes(1);
    expect(mockedTransport.verify).toHaveBeenCalledTimes(1);
    expect(mockedTransport.close).toHaveBeenCalledTimes(1);
    done();
  });
  test("send reports all", async (done) => {
    globals.setAdminOnly(false);
    const report = buildTestReport();
    db.addReports(report);
    await sendReports();
    const mockedTransport = nodemailer.createTransport();
    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(mockedTransport.sendMail).toHaveBeenCalled();
    expect(mockedTransport.verify).toHaveBeenCalled();
    expect(mockedTransport.close).toHaveBeenCalled();
    done();
  });
  test("wrap in code", () => {
    const txt = "foo";
    expect(wrapInCodeTags(txt)).toBe(`<pre><code>${txt}</code></pre>`);
  });
});
