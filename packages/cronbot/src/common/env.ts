// process
const API_HOST: string | undefined = process.env.API_HOST;
const API_VERSION: string | undefined = process.env.API_VERSION;
const AUTH0_AUDIENCE: string | undefined = process.env.AUTH0_AUDIENCE;
const AUTH0_CLIENT_ID: string | undefined = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET: string | undefined = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_TOKEN_ISSUER: string | undefined = process.env.AUTH0_TOKEN_ISSUER;
const MAILGUN_DOMAIN: string | undefined = process.env.MAILGUN_DOMAIN;
const MAILGUN_APIKEY: string | undefined = process.env.MAILGUN_APIKEY;
const MAILGUN_FROM: string | undefined = process.env.MAILGUN_FROM;
const MAILGUN_TO: string | undefined = process.env.MAILGUN_TO;
const FLSSHYGN_PREDICT_URL: string | undefined =
  process.env.FLSSHYGN_PREDICT_URL;
// dereived
const API_URL: string | undefined = `${API_HOST}/api/${API_VERSION}`;
let CRONBOT_API_TOKEN: string | undefined = undefined;

export const setApiToken: (token: string) => void = (token) => {
  CRONBOT_API_TOKEN = token;
};

export const getApiToken: () => string | undefined = () => {
  return CRONBOT_API_TOKEN;
};

// #########
if (MAILGUN_DOMAIN === undefined && process.env.NODE_ENV !== "test") {
  throw new Error("MAILGUN_DOMAIN is not defined");
}
if (MAILGUN_APIKEY === undefined && process.env.NODE_ENV !== "test") {
  throw new Error("MAILGUN_APIKEY is not defined");
}
if (MAILGUN_FROM === undefined && process.env.NODE_ENV !== "test") {
  throw new Error("MAILGUN_FROM is not defined");
}
if (MAILGUN_TO === undefined && process.env.NODE_ENV !== "test") {
  throw new Error("MAILGUN_TO is not defined");
}
if (AUTH0_AUDIENCE === undefined && process.env.NODE_ENV !== "test") {
  throw new Error("AUTH0_AUDIENCE is not defined");
}
if (AUTH0_CLIENT_ID === undefined && process.env.NODE_ENV !== "test") {
  throw new Error("AUTH0_CLIENT_ID is not defined");
}
if (AUTH0_CLIENT_SECRET === undefined && process.env.NODE_ENV !== "test") {
  throw new Error("AUTH0_CLIENT_SECRET is not defined");
}
if (FLSSHYGN_PREDICT_URL === undefined && process.env.NODE_ENV !== "test") {
  throw new Error("FLSSHYGN_PREDICT_URL is not defined");
}
if (AUTH0_TOKEN_ISSUER === undefined && process.env.NODE_ENV !== "test") {
  throw new Error("AUTH0_TOKEN_ISSUER is not defined");
}
if (API_HOST === undefined && process.env.NODE_ENV !== "test") {
  throw new Error("API_HOST is not defined");
}

if (API_VERSION === undefined && process.env.NODE_ENV !== "test") {
  throw new Error("API_VERSION is not defined");
}
if (API_URL === undefined && process.env.NODE_ENV !== "test") {
  throw new Error("API_URL cis not defined");
}

if (/undefined/gi.exec(API_URL) !== null) {
  throw new Error("API_URL contains the word undefined");
}

export {
  API_URL,
  API_VERSION,
  API_HOST,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_TOKEN_ISSUER,
  AUTH0_AUDIENCE,
  CRONBOT_API_TOKEN,
  MAILGUN_DOMAIN,
  MAILGUN_APIKEY,
  MAILGUN_FROM,
  MAILGUN_TO,
  FLSSHYGN_PREDICT_URL,
};
