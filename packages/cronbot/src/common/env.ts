// process
const API_HOST: string | undefined = process.env.API_HOST;
const API_VERSION: string | undefined = process.env.API_VERSION;
const AUTH0_AUDIENCE: string | undefined = process.env.AUTH0_AUDIENCE;
const AUTH0_CLIENT_ID: string | undefined = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET: string | undefined = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_TOKEN_ISSUER: string | undefined = process.env.AUTH0_TOKEN_ISSUER;
// dereived
const API_URL: string | undefined = `${API_HOST}/api/${API_VERSION}`;

// #########
if (AUTH0_AUDIENCE === undefined) {
  throw new Error("AUTH0_AUDIENCE is not defiend");
}
if (AUTH0_CLIENT_ID === undefined) {
  throw new Error("CLIEAUTH0_CLIENT_IDNT_ID is not defiend");
}
if (AUTH0_CLIENT_SECRET === undefined) {
  throw new Error("AUTH0_CLIENT_SECRET is not defiend");
}

if (AUTH0_TOKEN_ISSUER === undefined) {
  throw new Error("AUTH0_TOKEN_ISSUER is not defiend");
}
if (API_HOST === undefined) {
  throw new Error("API_HOST is not defiend");
}

if (API_VERSION === undefined) {
  throw new Error("API_VERSION is not defiend");
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
};
