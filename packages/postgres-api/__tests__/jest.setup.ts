import 'jest';
import { config } from 'dotenv';
import path from 'path';

import {
  getNewToken,
  optionsTokenRequest,
  readTokenFromDisc,
} from './test-utils';
config({ path: path.resolve(__dirname, './.env.test') });

// const buildRequestOptions = (token: IDiskToken) => {
//   const optionsTokenTest: rq.OptionsWithUrl = {
//     url: process.env.API_PING_URL,
//     headers: { authorization: `${token.token_type} ${token.access_token}` },
//     resolveWithFullResponse: true,
//   }
//   return optionsTokenTest;
// }

module.exports = async () => {
  const tokenFilePath = path.resolve(__dirname, './.test.token.json');
  // eslint-disable-next-line no-console
  console.log('Setup jest for all tests');
  const token = readTokenFromDisc(tokenFilePath);
  // console.log(token);
  // process.exit(0);
  // try{

  //   jwt.verify(token.access_token, getKey,function (err, decoded) {
  //     console.log('in CB');
  //     if(err){
  //       console.error(err);
  //       throw err;
  //     }
  //     console.log('Decoded',decoded);
  //     process.exit();
  //   });
  // }catch(e){
  //   console.error(e);
  // }

  if (token === undefined) {
    // get a new token
    try {
      await getNewToken(tokenFilePath, optionsTokenRequest);
    } catch (error) {
      throw error;
    }
  } else {
    // use existing token from disk
    // use the existing one
    // try {
    //   // make a test request to the ping endpoint
    //   const opts = buildRequestOptions(token)
    //   const response = await rq(opts);
    //   if (response.statusCode !== 200) {
    //     // request with existing token was rejected
    //     // token does not work
    //     // get a new one and write to disk
    //     await getNewToken(tokenFilePath, optionsTokenRequest);
    //     // read it again
    //     token = readTokenFromDisc(tokenFilePath);
    //     // make another test rewquest
    //     const opts = buildRequestOptions(token)
    //     const response = await rq(opts);
    //     if (response.status !== 200) {
    //       throw new Error('Newly requested token was also rejected abort!');
    //     } else {
    //       console.info(response.body);
    //       console.info('Got a response from the ping of the api. Everything OK');
    //     }
    //   } else {
    //     console.info(response.body);
    //   }
    // } catch (error) {
    //   console.error(error.message);
    //   throw error;
    // }
    // token does not work? abort!
  }
  console.log('done with setup');
};
