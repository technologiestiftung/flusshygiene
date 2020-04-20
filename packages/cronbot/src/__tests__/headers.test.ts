import { buildHeaders, defaultHeaders } from "../common/headers";
describe("Testing headers", () => {
  test("should build a header with the default value and some additional ones", () => {
    expect(buildHeaders()).toEqual(defaultHeaders);
    expect(buildHeaders({ auth: "foo" })).toHaveProperty("auth");
    expect(buildHeaders()).toMatchSnapshot({
      "user-agent": expect.any(String),
    });
    expect(buildHeaders({ "user-agent": "foo" })).toEqual({
      "user-agent": "foo",
    });
  });
});
