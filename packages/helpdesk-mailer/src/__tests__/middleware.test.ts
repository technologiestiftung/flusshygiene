import { propertyCheckMiddleware } from "../lib/middleware";
import { buildReq, buildRes, buildNext } from "./utlis/factories";

// const mockMailer = jest.mock("../lib/mailer.ts");
beforeEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});
describe("middleware test", () => {
  test("propertyCheckMiddleware tests missing props", () => {
    const res = buildRes();
    const req = buildReq({ body: { email: "", name: "", text: "" } });
    const next = buildNext();
    propertyCheckMiddleware(req, res, next);
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
  test("propertyCheckMiddleware email is missing", () => {
    const res = buildRes();
    const req = buildReq({ body: { name: "", text: "" } });
    const next = buildNext();
    propertyCheckMiddleware(req, res, next);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(next).not.toHaveBeenCalled();
  });
  test("propertyCheckMiddleware name is missing", () => {
    const res = buildRes();
    const req = buildReq({ body: { email: "", text: "" } });
    const next = buildNext();
    propertyCheckMiddleware(req, res, next);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(next).not.toHaveBeenCalled();
  });
  test("propertyCheckMiddleware text is missing", () => {
    const res = buildRes();
    const req = buildReq({ body: { email: "", name: "" } });
    const next = buildNext();
    propertyCheckMiddleware(req, res, next);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(next).not.toHaveBeenCalled();
  });
});
