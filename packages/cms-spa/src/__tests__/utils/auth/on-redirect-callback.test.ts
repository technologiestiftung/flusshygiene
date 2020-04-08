import { onRedirectCallback } from "./../../../lib/auth/on-redirect-callback";

describe("Testing redicrect callback", () => {
  test("should set window history", () => {
    onRedirectCallback({ targetUrl: "/foo" });
    expect(window.location.href).toBe("http://localhost/foo");
  });
  test("should set window history to pathname", () => {
    onRedirectCallback({ targetUrl: undefined });
    expect(window.location.href).toBe(
      `http://localhost${window.location.pathname}`,
    );
  });
});
