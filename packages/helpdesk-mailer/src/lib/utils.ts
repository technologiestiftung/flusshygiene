import { BuildMessage } from "./common/interfaces";
import { Options } from "nodemailer/lib/mailer";

export function wrapInCodeTags(text: string): string {
  return `<pre><code>${text}</code></pre>`;
}

export function buildMessage(options: BuildMessage): Options {
  // eslint-disable-next-line prefer-const
  let { text, html, subject, from, to, attachments } = options;
  if (!subject) {
    subject = "[Flusshygiene] Flussbaden User Report";
  }
  const defaultFrom = process.env.SMTP_FROM;
  if (!defaultFrom && !from) throw new Error("SMTP_FROM or from are undefined");
  from = from ? from : defaultFrom;
  if (!from) throw new Error("from address still undefined");
  return { text, html, subject, from, to, attachments };
}
