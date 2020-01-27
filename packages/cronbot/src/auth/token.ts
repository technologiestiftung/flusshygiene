import path from "path";
import { setApiToken, getApiToken } from "./../common/env";
import { gotOptionsFactory } from "../utils/got-util";
import fs from "fs";
import got from "got";
import {
  AUTH0_TOKEN_ISSUER,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE,
} from "../common/env";

export interface IToken {
  access_token: string;
  token_type: "Bearer";
}
export const getNewToken: () => Promise<IToken> = async () => {
  try {
    const response = got.post({
      url: `${AUTH0_TOKEN_ISSUER}`,
      headers: { "content-type": "application/json" },
      json: {
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        audience: AUTH0_AUDIENCE,
        grant_type: "client_credentials",
      },
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const testToken: (token: string) => Promise<boolean> = async (token) => {
  try {
    const opts = await gotOptionsFactory({ headers: { authorization: token } });
    const response = await got(opts);
    if (response.statusCode !== 200) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const getFromDisk: (
  filePath?: string,
) => Promise<string | undefined> = async (filePath) => {
  try {
    if (filePath === undefined) {
      return undefined;
    }
    // console.log("Getting token from disk"); // eslint-disable-line
    if (fs.existsSync(filePath) === false) {
      console.warn(`Path to disk token is wrong "${filePath}"`);
      return undefined;
    }
    const token = fs.readFileSync(filePath, "utf8");
    if (token.startsWith("Bearer ") === false) {
      console.warn("Token format is wrong. Does not start with 'Bearer'");
      return undefined;
    }
    return token;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

// getToken
// 1. check for token on disc
//  if it existsSync
// 2. testToken
// 2.1 it works set ApiTpoken
// 2.2. return token
// 3. testFaild
// 4. getNewToken
// 5. testToken
// setApiToken
// return token

/**
 *
 * This function should only be called once on entry
 */
export const getTokenOnce: (tokenPath?: string) => Promise<string> = async (
  tokenPath,
) => {
  try {
    // read from constants
    let token = getApiToken();
    if (token !== undefined && (await testToken(token)) === true) {
      // it works great return it
      setApiToken(token);
      return token;
    }
    // did not work read from disk
    token = await getFromDisk(tokenPath);
    // console.log(token);

    if (token !== undefined && (await testToken(token)) === true) {
      //  great it worked
      // console.log("token works");
      setApiToken(token);
      return token;
    } else {
      // did not work reset token
      token = undefined;
    }

    const res = await getNewToken();
    token = `${res.token_type} ${res.access_token}`;
    if (token === undefined) {
      throw new Error("Token is still undefined");
    }
    if ((await testToken(token)) === false) {
      throw new Error("Token is still invalid");
    }
    fs.writeFileSync(path.resolve(process.cwd(), ".token"), token, "utf8");
    setApiToken(token);
    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
