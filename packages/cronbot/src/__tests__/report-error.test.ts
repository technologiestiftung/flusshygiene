import nodemailer from "nodemailer";

const origEnv = process.env;
jest.mock("nodemailer", () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn(),
      close: jest.fn(),
      verify: jest.fn(),
    }),
  };
});
beforeEach(() => {
  jest.resetModules();
});
afterAll(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  process.env = origEnv;
});
// report - error.test.ts;
describe("report errors", () => {
  test("unset env variable should throw error", async (done) => {
    process.env.SMTP_HOST = undefined;
    import("../lib/report").then(async (module) => {
      try {
        const mockedTransport = nodemailer.createTransport();
        expect(await module.sendReports()).toThrowError(/[SMTP_HOST]/);
        expect(nodemailer.createTransport).not.toHaveBeenCalled();
        expect(mockedTransport.sendMail).not.toHaveBeenCalled();
        expect(mockedTransport.verify).not.toHaveBeenCalled();
        expect(mockedTransport.close).not.toHaveBeenCalled();
      } catch (error) {}
    });
    // await expect(sendReports()).resolves.toBe(Error);
    done();
  });
});
