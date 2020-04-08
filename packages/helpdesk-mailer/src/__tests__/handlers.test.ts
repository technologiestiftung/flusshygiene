import { getHandler, postHandler } from "../lib/handlers";
import { buildReq, buildRes } from "./utlis/factories";
import * as mailerLib from "../lib/mailer";
// const mockMailer = jest.mock("../lib/mailer.ts");
beforeEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});
describe("request handlers", () => {
  test("get handler", () => {
    const res = buildRes();
    const req = buildReq();
    getHandler(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });

  test("post handler", () => {
    const res = buildRes({ statusCode: 201 });
    const req = buildReq();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    mailerLib.mailer = jest.fn();
    postHandler(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(201);
    expect(mailerLib.mailer).toHaveBeenCalledTimes(1);
    expect(mailerLib.mailer).toHaveBeenCalledWith(req.body);
  });
  test("post handler error", () => {
    const res = buildRes({ statusCode: 500 });
    const req = buildReq();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    mailerLib.mailer = jest.fn().mockImplementation(function (): void {
      throw Error();
    });
    postHandler(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(500);
    expect(mailerLib.mailer).toHaveBeenCalledTimes(1);
    expect(mailerLib.mailer).toHaveBeenCalledWith(req.body);
  });
});
