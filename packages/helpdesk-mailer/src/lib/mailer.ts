import { GenericObject } from "./common/interfaces";
import nodemailer from "nodemailer";
import { wrapInCodeTags, buildMessage } from "./utils";
import Mail, { Options } from "nodemailer/lib/mailer";
const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PW;
const port = process.env.SMTP_PORT;
// const from = process.env.SMTP_FROM;
const adminTo = process.env.SMTP_ADMIN_TO;

export async function mailer(body: GenericObject): Promise<void> {
  let transporter: Mail | undefined;
  try {
    if (host === undefined) throw new Error("SMTP_HOST is undefined");
    if (user === undefined) throw new Error("SMTP_USER is undefined");
    if (pass === undefined) throw new Error("SMTP_PW is undefined");
    if (port === undefined) throw new Error("SMTP_PORT is undefined");
    // if (from === undefined) throw new Error("SMTP_FROM is undefined");
    if (adminTo === undefined) throw new Error("SMTP_ADMIN_TO is undefined");
    transporter = nodemailer.createTransport({
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //@ts-ignore
      pool: true,
      secure: true,
      port,
      host,
      auth: {
        user,
        pass,
      },
    });
    if (!transporter) throw new Error("transporter is undefined");
    await transporter.verify();
    const adminText = `
    ${JSON.stringify(body, null, 2)}
`;
    const adminHtml = wrapInCodeTags(JSON.stringify(body, null, 2));
    const message: Options = buildMessage({
      to: adminTo,
      text: adminText,
      html: adminHtml,
    });
    const res = await transporter.sendMail(message);
    console.log(res);
    transporter.close();
  } catch (error) {
    console.error(error);
    if (transporter) transporter.close();
    throw error;
  }
}
