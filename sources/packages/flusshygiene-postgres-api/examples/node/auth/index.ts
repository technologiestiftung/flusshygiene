// import { config } from 'dotenv';
import * as rq from 'request-promise-native';
import * as path from 'path';
import * as fs from 'fs';


export const optionsTokenRequest: rq.OptionsWithUrl = {
  // tslint:disable-next-line: max-line-length
  body: `{"client_id":"${process.env.AUTH0_CLIENT_ID}","client_secret":"${process.env.AUTH0_CLIENT_SECRET}","audience":"${process.env.AUTH0_AUDIENCE}","grant_type":"client_credentials"}`,
  headers: { 'content-type': 'application/json' },
  method: 'POST',
  url: process.env.AUTH0_REQ_URL!,
  resolveWithFullResponse: true,
};

export interface IDiskToken {
  access_token: string;
  token_type: string;
  issance: number;
}

const isTokenOutdated: (issuance_ms: number, issuance_duration_ms: number) => boolean = (issuance_ms, issuance_duration_ms) => {
  const now = new Date();

  if ((now.getTime() - issuance_ms) < issuance_duration_ms) {
    return true;
  }
  return false;
}


export const readTokenFromDisc: (filePath: string) => Promise<IDiskToken> = async (filePath) => {
  try {
    if (fs.existsSync(filePath) === true) {
      const content = fs.readFileSync(filePath, 'utf8');
      const json = JSON.parse(content);
      // the file does not have what we want
      if (json.hasOwnProperty('access_token') === false || json.hasOwnProperty('token_type') === false) {
        // return undefined;
        await getNewToken(filePath, optionsTokenRequest);
      }
      if (isTokenOutdated(json.issance, json.expires_in * 1000) === true) {
        await getNewToken(filePath, optionsTokenRequest);
      }

      const options: rq.OptionsWithUrl = {
        url: process.env.API_URL!,
        method: 'GET',
        headers: { authorization: `${json.token_type} ${json.access_token}`, Accept: 'application/json' },
        resolveWithFullResponse: true,
        json: true
      }
      const response = await rq(options);
      if (response.statusCode !== 200) {
        await getNewToken(filePath, optionsTokenRequest);
      }
      return json;
    } else {
      await getNewToken(filePath, optionsTokenRequest);
    }
  } catch (error) {
    console.error(error);
  }
};

const writeTokenToDisk: (filePath: string, dataStr: string) => void = (filePath, dataStr) => {
  console.info('writing token to disk');
  fs.writeFileSync(filePath, dataStr);
}


export const getNewToken: (filePath: string, opts: rq.OptionsWithUrl) => Promise<void> = async (filePath, opts) => {
  try {
    const response = await rq(opts);
    if (response.statusCode !== 200) {
      console.log(response);
      throw new Error('Status on new token request is not 200');
    } else {
      // console.log(response.body);
      const parsedBody = JSON.parse(response.body);
      parsedBody.issuance = new Date().getTime();
      writeTokenToDisk(filePath, JSON.stringify(parsedBody));
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}




(async () => {
  try {

    const token = await readTokenFromDisc(path.resolve(process.cwd(), './token.json'));
    if (token === undefined) {
      throw new Error('Token does not exists');
    }
    const headers = { authorization: `${token.token_type} ${token.access_token}`, Accept: 'application/json' };
      const options: rq.OptionsWithUrl = {
        url: process.env.API_URL!,
        method: 'GET',
        headers
      }

    const response = await rq(options);
    // const response = await request(app).post('/default/post')
    //   .send({})
    //   .set(headers);
    console.log(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
})();
