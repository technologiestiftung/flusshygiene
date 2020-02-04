import { globals } from "./../common/globals";
import fs from "fs";
import got from "got";
import FormData from "form-data";

import { DB } from "./DB";
import { IReport, IBuildReport } from "./../common/interfaces";
import { MAILGUN_TO, MAILGUN_FROM } from "../common/env";
import { logger } from "../utils/logger";
import { resolve } from "path";

const db = DB.getInstance();

export const setupForm: (data: {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  addFile: boolean;
}) => FormData = ({ from, to, subject, text, html, addFile }) => {
  const form = new FormData();
  form.append("from", from);
  form.append("to", to);
  form.append("subject", subject);
  form.append("text", text);
  form.append("html", `<body><pre><code>${html}</code></pre></body>`);
  if (addFile) {
    form.append(
      "attachment",
      fs.createReadStream(resolve(process.cwd(), "db.json")),
    );
  }
  return form;
};

export const sendReports: () => Promise<void> = async () => {
  try {
    const adminText = `
## Reports:
    ${JSON.stringify(db.getReports(), null, 2)}
`;
    const adminHtml = `${JSON.stringify(db.getReports(), null, 2)}`;
    const adminForm = setupForm({
      to: MAILGUN_TO!,
      from: `Mailgun Sandbox <${MAILGUN_FROM}>`,
      text: adminText,
      html: adminHtml,
      subject: `[Flusshygiene] Cronbot report`,
      addFile: true,
    });

    try {
      await got.post({
        url: `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
        username: "api",
        password: process.env.MAILGUN_APIKEY!,
        body: adminForm,
      });
    } catch (eadmin) {
      logger.error(JSON.stringify(eadmin));
    }
  } catch (error) {
    throw error;
  }

  if (globals.ADMIN_ONLY === false) {
    // send reports to all users
    const sortedReports = db.getReportsSorted();
    logger.info(JSON.stringify(sortedReports));
  }
};

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
