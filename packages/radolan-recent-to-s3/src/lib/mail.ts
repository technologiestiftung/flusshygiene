import { logger } from "./logger";
import fs, { ReadStream } from "fs";
import nodemailer from "nodemailer";
import path from "path";
interface IBuildMessage {
  text: string;
  html: string;
  to: string;
  from?: string;
  subject?: string;
  attachments?: IAttatchment[];
}

interface IAttatchment {
  filename: string;
  content: ReadStream;
}
export interface IMailOpts {
  text: string;
  subject: string;
  host: string;
  user: string;
  pass: string;
  port: number;
  to: string;
}

const buildMessage: (options: IBuildMessage) => any = ({
  text,
  html,
  subject = `[Flusshygiene] radolan recent`,
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

export const mail: (options: IMailOpts) => Promise<void> = async ({
  text,
  user,
  pass,
  port,
  host,
  to,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      secure: true,
      port,
      host,
      auth: {
        user,
        pass,
      },
    });
    transporter.verify();
    const message = buildMessage({
      to,
      text,
      html: wrapInCodeTags(text),
      attachments: [
        {
          filename: "error.log",
          content: fs.createReadStream(
            path.resolve(process.cwd(), "error.log"),
          ),
        },
        {
          filename: "combined.log",
          content: fs.createReadStream(
            path.resolve(process.cwd(), "combined.log"),
          ),
        },
      ],
    });

    const res = await transporter.sendMail(message);
    logger.info(JSON.stringify(res));
  } catch (error) {
    logger.error(error);
  }
};
