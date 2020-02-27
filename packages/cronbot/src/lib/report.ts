import { globals } from "./../common/globals";
import fs, { ReadStream } from "fs";
import { DB } from "./DB";
import { IReport, IBuildReport } from "./../common/interfaces";
// import { MAILGUN_TO, MAILGUN_FROM } from "../common/env";
import { logger } from "../utils/logger";
import { resolve } from "path";
import nodemailer from "nodemailer";

const db = DB.getInstance();

/**
 * @deprecated in favour of nodemailer
 */
// export const setupForm: (data: {
//   from: string;
//   to: string;
//   subject: string;
//   text: string;
//   html: string;
//   addFile: boolean;
// }) => FormData = ({ from, to, subject, text, html, addFile }) => {
//   const form = new FormData();
//   form.append("from", from);
//   form.append("to", to);
//   form.append("subject", subject);
//   form.append("text", text);
//   form.append("html", `<body><pre><code>${html}</code></pre></body>`);
//   if (addFile) {
//     form.append(
//       "attachment",
//       fs.createReadStream(resolve(process.cwd(), "db.json")),
//     );
//   }
//   return form;
// };

interface IBuildMessage {
  text: string;
  html: string;
  to: string;
  from?: string;
  subject?: string;
  attachments?: {
    filename: string;
    content: ReadStream;
  };
}

const buildMessage: (options: IBuildMessage) => any = ({
  text,
  html,
  subject = `[Flusshygiene] Cronbot report`,
  from,
  to,
  attachments,
}) => {
  const defaultFrom = process.env.SMTP_FROM;
  if (defaultFrom === undefined) throw new Error("SMTP_FROM is undefined");
  from = from ? from : defaultFrom;

  return { text, html, subject, from, to, attachments };
};

export const wrapInCodeTags = (text: string) =>
  `<pre><code>${text}</code></pre>`;
export const sendReports: () => Promise<void> = async () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PW;
  const port = process.env.SMTP_PORT;
  // const from = process.env.SMTP_FROM;
  const adminTo = process.env.SMTP_ADMIN_TO;

  if (host === undefined) throw new Error("SMTP_HOST is undefined");
  if (user === undefined) throw new Error("SMTP_USER is undefined");
  if (pass === undefined) throw new Error("SMTP_PW is undefined");
  if (port === undefined) throw new Error("SMTP_PORT is undefined");
  // if (from === undefined) throw new Error("SMTP_FROM is undefined");
  if (adminTo === undefined) throw new Error("SMTP_ADMIN_TO is undefined");
  const transporter = nodemailer.createTransport({
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
  try {
    await transporter.verify();
    const adminText = `
        ${JSON.stringify(db.getReports(), null, 2)}
    `;
    const adminHtml = wrapInCodeTags(JSON.stringify(db.getReports(), null, 2));
    const message = buildMessage({
      to: adminTo,
      text: adminText,
      html: adminHtml,
      attachments: {
        filename: "db.json",
        content: fs.createReadStream(resolve(process.cwd(), "db.json")),
      },
    });

    const res = await transporter.sendMail(message);
    logger.info(res);

    if (globals.ADMIN_ONLY === false) {
      // send reports to all users
      const sortedReports = db.getReportsSorted();
      logger.info(sortedReports);
      const messages = sortedReports.map((usersReports) => {
        const to = usersReports[0].email;
        const texts = usersReports.map((item) => {
          return JSON.stringify(
            item,
            ["id", "type", "message", "specifics"],
            2,
          );
        });
        const text = texts.join("\n");
        const html = wrapInCodeTags(text);

        const message = buildMessage({ to, text, html });
        return message;
      });

      for (const message of messages) {
        try {
          const info = await transporter.sendMail(message);
          logger.info(info);
        } catch (sendMailError) {
          logger.error(sendMailError);
        }
      }
      transporter.close();
    } else {
      transporter.close();
    }
  } catch (error) {
    logger.error(error);
    transporter.close();
    throw error;
  }
};

/**
 * @deprecated in favour of noddemailer
 */
// export const sendReportsMailgun: () => Promise<void> = async () => {
//   try {
//     const adminText = `
// ## Reports:
//     ${JSON.stringify(db.getReports(), null, 2)}
// `;
//     const adminHtml = `${JSON.stringify(db.getReports(), null, 2)}`;
//     const adminForm = setupForm({
//       to: MAILGUN_TO!,
//       from: `Mailgun Sandbox <${MAILGUN_FROM}>`,
//       text: adminText,
//       html: adminHtml,
//       subject: `[Flusshygiene] Cronbot report`,
//       addFile: true,
//     });

//     try {
//       await got.post({
//         url: `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
//         username: "api",
//         password: process.env.MAILGUN_APIKEY!,
//         body: adminForm,
//       });
//     } catch (eadmin) {
//       logger.error(JSON.stringify(eadmin));
//     }
//   } catch (error) {
//     throw error;
//   }

//   if (globals.ADMIN_ONLY === false) {
//     // send reports to all users
//     const sortedReports = db.getReportsSorted();
//     logger.info(JSON.stringify(sortedReports));
//   }
// };

export const buildReport: (data: IBuildReport) => IReport = ({
  id,
  message,
  source,
  type,
  stack,
  email,
  specifics,
}) => {
  const res: IReport = { email, id, message, source, type, stack, specifics };
  return res;
};
