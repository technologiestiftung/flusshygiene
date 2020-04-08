import { Attachment } from "nodemailer/lib/mailer";

export interface GenericObject {
  [key: string]: unknown;
}

export interface BuildMessage {
  text: string;
  html: string;
  to: string;
  from?: string;
  subject?: string;
  attachments?: Attachment[];
}

export interface Message extends BuildMessage {
  from: string;
  subject: string;
}
