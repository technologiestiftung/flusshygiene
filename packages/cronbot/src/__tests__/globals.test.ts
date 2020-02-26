import { globals } from "../common/globals";
describe("globals", () => {
  test("testing globals get and set", () => {
    expect(globals.ADMIN_ONLY).toBeUndefined();
    expect(globals.PREDICT).toBeUndefined();
    expect(globals.VERBOSE).toBeUndefined();
    expect(globals.SKIP_MAIL).toBeUndefined();
    globals.setPredict(true);
    globals.setAdminOnly(true);
    globals.setSkipMail(true);
    globals.setVerbose(true);
    expect(globals.ADMIN_ONLY).toBeDefined();
    expect(globals.PREDICT).toBeDefined();
    expect(globals.VERBOSE).toBeDefined();
    expect(globals.SKIP_MAIL).toBeDefined();

    expect(globals.ADMIN_ONLY).toBe(true);
    expect(globals.PREDICT).toBe(true);
    expect(globals.VERBOSE).toBe(true);
    expect(globals.SKIP_MAIL).toBe(true);
  });
});
