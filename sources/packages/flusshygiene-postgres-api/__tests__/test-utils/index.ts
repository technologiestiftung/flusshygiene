import  rq  from 'request-promise-native';
import fs from 'fs';
import util from 'util';
import path from 'path';
import { config } from 'dotenv';
import { Connection, createConnection, getRepository } from 'typeorm';

import { DefaultRegions, UserRole } from '../../src/lib/common';
import { Rain,
  GlobalIrradiance,
  Discharge,
  PurificationPlant,
  PPlantMeasurement,
  GenericInput,
  GInputMeasurement,
  Event,
  User,
  Region,
  Questionaire,
  Bathingspot,
  BathingspotModel,
  BathingspotPrediction,
  BathingspotRawModelData,
  BathingspotMeasurement,
} from '../../src/orm/entity';

import {createUser } from '../../src/setup/create-test-user';



config({ path: path.resolve(__dirname, '../.env.test') });

export async function closeTestingConnections(connections: Connection[]) {
  return Promise.all(connections.map(
    connection => connection && connection.isConnected ? connection.close() : undefined));

}
export async function createTestingConnections() {
  const connection = await createConnection({
    database: 'postgres',
    dropSchema: true,
    entities: [
      User,
      Region,
      Questionaire,
      Bathingspot,
      BathingspotModel,
      BathingspotPrediction,
      BathingspotRawModelData,
      BathingspotMeasurement,
      Event,
      Rain,
      GlobalIrradiance,
      Discharge,
      PurificationPlant,
      PPlantMeasurement,
      GenericInput,
      GInputMeasurement,
    ],
    host: 'localhost',
    logging: false,
    password: 'postgres_password',
    port: 5432,
    synchronize: true,
    type: 'postgres',
    username: 'postgres',
  });
  const user = new User();
  user.firstName = 'James';
  user.lastName = 'Bond';
  user.role = UserRole.creator;
  user.email = 'faker@fake.com';
  const spot = new Bathingspot();
  const regions: Region[] = [];
  for (const key in DefaultRegions) {
    if (DefaultRegions.hasOwnProperty(key)) {
      const r = new Region();
      r.name = key;
      r.displayName = key;
      regions.push(r);
    }
  }
  spot.region = regions[0];
  spot.isPublic = true;
  spot.name = 'billabong';

  user.bathingspots = [spot];
  await connection.manager.save(regions);
  // console.log(resregions);
  await connection.manager.save(spot);
  // console.log(resspot);
  await connection.manager.save(user);
  const us = await connection.manager.save(createUser());
  // console.log(resuser);

  await getRepository(Region).find();
  // console.log(users);
  // await Promise.all([connection].map(con => {
  //   console.log('creating connection');

  //   // doo all the setup
  //    // const db = await con.connect();
  //   // process.stdout.write(db.name);
  //   con.manager.save(createProtectedUser()).then(() => {
  //     const user = new User();
  //     user.firstName = 'James';
  //     user.lastName = 'Bond';
  //     user.role = UserRole.creator;
  //     user.email = 'faker@fake.com';
  //     const spot = new Bathingspot();
  //     const regions: Region[] = [];
  //     for (const key in DefaultRegions) {
  //       if (DefaultRegions.hasOwnProperty(key)) {
  //         const r = new Region();
  //         r.name = key;
  //         r.displayName = key;
  //         regions.push(r);
  //       }
  //     }
  //     spot.region = regions[0];
  //     spot.isPublic = true;
  //     spot.name = 'billabong';

  //     user.bathingspots = [spot];
  //     con.manager.save(regions).then(() => {
  //       con.manager.save(spot).then(() => {
  //         con.manager.save(user).then(() => {
  //           console.log('done with setup');
  //          }).catch(err => { throw err; });
  //       }).catch(err => { throw err; });
  //     }).catch(err => { throw err; });
  //   }).catch(err => { throw err; });

  // }));

  // console.log('creating connection done');
  return [connection];
}
export async function reloadTestingDatabases(connections: Connection[]) {
  return Promise.all(connections.map(connection => connection.synchronize(true)));

}

export const readFileAsync = util.promisify(fs.readFile);
export const optionsTokenRequest: rq.OptionsWithUrl = {
  // tslint:disable-next-line: max-line-length
  body: `{"client_id":"${process.env.AUTH0_CLIENT_ID}","client_secret":"${process.env.AUTH0_CLIENT_SECRET}","audience":"${process.env.AUTH0_AUDIENCE}","grant_type":"client_credentials"}`,
  headers: { 'content-type': 'application/json' },
  method: 'POST',
  url: process.env.AUTH0_REQ_URL,
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


export const readTokenFromDisc: (filePath: string) => IDiskToken | undefined = (filePath) => {
  if (fs.existsSync(filePath) === true) {
    const content = fs.readFileSync(filePath, 'utf8');
    try {
      const json = JSON.parse(content);
      // the file does not have what we want
      if (json.hasOwnProperty('access_token') === false || json.hasOwnProperty('token_type') === false) {
        return undefined;
      }
      if(isTokenOutdated(json.issance, json.expires_in * 1000) === true){
        getNewToken(filePath, optionsTokenRequest);
      }
      return json;
    } catch (error) {

      // console.error('this is the error ', error.message);
      console.error(error);
    }
  } else {
    return undefined;
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
