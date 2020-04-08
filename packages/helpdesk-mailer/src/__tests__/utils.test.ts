import { wrapInCodeTags, buildMessage } from "../lib/utils";
import { BuildMessage } from "../lib/common/interfaces";
describe("utilities", () => {
  test("rap in code", () => {
    const text = "123";
    const result = wrapInCodeTags(text);
    expect(result).toContain(text);
    expect(result).toMatch(/<pre><code>123<\/code><\/pre>/);
  });

  test("build message missing env", () => {
    expect(() => {
      const text = "";
      const html = "";
      const to = "";
      const opts: BuildMessage = { text, html, to };
      buildMessage(opts);
    }).toThrow();
  });
  test("build message with smpt from", async () => {
    const text = "";
    const html = "";
    const to = "";
    const mail = "foo@bah.com";
    const opts: BuildMessage = { text, html, to };
    process.env.SMTP_FROM = mail;
    const module = await import("../lib/utils");
    const result = module.buildMessage(opts);
    expect(result.from).toBe(mail);
    expect(result.subject).toMatch("[Flusshygiene] Flussbaden User Report");
    expect(result.subject).toBeDefined();
    delete process.env.SMTP_FROM;
  });
  test("build message with set from", async () => {
    const text = "";
    const html = "";
    const to = "";
    const subject = "foo";
    const from = "foo@bah.com";
    const opts: BuildMessage = { text, html, to, from, subject };
    const module = await import("../lib/utils");
    const result = module.buildMessage(opts);
    expect(result.from).toBe(from);
    expect(result.subject).toBe(subject);
    delete process.env.SMTP_FROM;
  });
});
