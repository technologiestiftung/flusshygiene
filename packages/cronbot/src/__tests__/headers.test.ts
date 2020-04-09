import { buildHeaders, defaultHeaders } from "../common/headers";
import { version } from "../utils/package-version";
describe("Testing headers", () => {
  test("should build a header with the default value and some additional ones", () => {
    expect(buildHeaders()).toEqual(defaultHeaders);
    expect(buildHeaders({ auth: "foo" })).toHaveProperty("auth");
    expect(buildHeaders()).toMatchSnapshot({
      "user-agent": `cronbot ${version}`,
    });
    expect(buildHeaders({ "user-agent": "foo" })).toEqual({
      "user-agent": "foo",
    });
  });
});
