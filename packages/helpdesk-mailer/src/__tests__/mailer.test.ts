import { Message } from "./../lib/common/interfaces";
import nodemailer from "nodemailer";
import * as utils from "../lib/utils";

jest.mock("nodemailer", () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn(),
      close: jest.fn(),
      verify: jest.fn(),
    }),
  };
});
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//@ts-ignore
utils.buildMessage = jest.fn().mockImplementation(() => {
  const message: Message = {
    from: "",
    subject: "",
    text: "",
    html: "",
    to: "",
  };
  return message;
});
describe("mailer", () => {
  test("call", async () => {
    const origProcess = process.env;
    process.env.SMTP_HOST = "";
    process.env.SMTP_USER = "";
    process.env.SMTP_PW = "";
    process.env.SMTP_PORT = "";
    process.env.SMTP_ADMIN_TO = "";
    process.env.SMTP_FROM = "";
    const module = await import("../lib/mailer");
    await module.mailer({});
    const mockedTransport = nodemailer.createTransport();
    expect(nodemailer.createTransport).toHaveBeenCalledTimes(2);
    expect(mockedTransport.verify).toHaveBeenCalledTimes(1);
    expect(mockedTransport.sendMail).toHaveBeenCalledTimes(1);
    expect(mockedTransport.close).toHaveBeenCalledTimes(1);
    process.env = origProcess;
  });
});
