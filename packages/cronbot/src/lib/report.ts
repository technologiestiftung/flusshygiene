import got from "got";
import FormData from "form-data";

import { DB } from "./DB";
import { IReport, IBuildReport } from "./../common/interfaces";
import { MAILGUN_TO, MAILGUN_FROM } from "../common/env";
import { logger } from "../utils/logger";

const db = DB.getInstance();

export const setupForm: (data: {
  from: string;
  to: string;
  subject: string;
  text: string;
}) => FormData = ({ from, to, subject, text }) => {
  const form = new FormData();
  form.append("from", from);
  form.append("to", to);
  form.append("subject", subject);
  form.append("text", text);
  return form;
};

export const sendReports: (reports: IReport[]) => Promise<void> = async (
  _reports,
) => {
  try {
    const adminText = `
## Reports:
    ${JSON.stringify(db.getReports(), null, 2)}
## State:
    ${JSON.stringify(db.getState())}
`;
    const adminForm = setupForm({
      to: MAILGUN_TO!,
      from: `Mailgun Sandbox <${MAILGUN_FROM}>`,
      text: adminText,
      subject: `[Flusshygiene] Cronbot report`,
    });

    try {
      await got.post({
        url: `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
        username: "api",
        password: process.env.MAILGUN_APIKEY!,
        body: adminForm,
      });
    } catch (eadmin) {
      logger.err(eadmin);
    }
  } catch (error) {
    throw error;
  }
};

export const buildReport: (data: IBuildReport) => IReport = ({
  id,
  message,
  source,
  type,
  stack,
  email,
}) => {
  const res: IReport = { email, id, message, source, type, stack };
  return res;
};
