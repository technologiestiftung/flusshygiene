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
    console.error(error.response.body);
    return error;
  }
};

export const getToken = async () => {
  if (process.env.CRONBOT_API_TOKEN === undefined) {
    const res = await getNewToken();
    const token = `${res.token_type} ${res.access_token}`;
    process.env.CRONBOT_API_TOKEN = token;
    return token;
  } else {
    // console.log(process.env.CRONBOT_API_TOKEN); // eslint-disable-line
    return process.env.CRONBOT_API_TOKEN;
  }
};
