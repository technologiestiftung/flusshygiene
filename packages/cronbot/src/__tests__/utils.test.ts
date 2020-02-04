import { unique } from "../utils/unique-values";
jest.mock("../common/env", () => {
  return {
    getApiToken: jest.fn().mockImplementation(() => "Bearer xyz"),
  };
});
import { gotOptionsFactory } from "../utils/got-util";

describe("utils", () => {
  test("got function factory", async (done) => {
    const mockConsoleErr = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn);
    await expect(gotOptionsFactory()).rejects.toThrow();
    mockConsoleErr.mockRestore();

    done();
  });
  test("unique values", () => {
    const data = [{ key: 1 }, { key: 2 }, { key: 1 }];
    expect(unique(data, "key")).toStrictEqual([{ key: 1 }, { key: 2 }]);
  });
});
