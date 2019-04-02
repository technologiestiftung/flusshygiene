import fs from 'fs';
import { Connection, createConnection, getCustomRepository } from 'typeorm';
import util from 'util';
import { RegionRepository } from '../../src/lib/repositories/RegionRepository';
import { DefaultRegions, UserRole } from '../../src/lib/types-interfaces';
import { Bathingspot } from '../../src/orm/entity/Bathingspot';
import { BathingspotModel } from '../../src/orm/entity/BathingspotModel';
import { BathingspotPrediction } from '../../src/orm/entity/BathingspotPrediction';
import { BathingspotRawModelData } from '../../src/orm/entity/BathingspotRawModelData';
import { Questionaire } from '../../src/orm/entity/Questionaire';
import { Region } from '../../src/orm/entity/Region';
import { User } from '../../src/orm/entity/User';
import {createUser } from '../../src/orm/fixtures/create-test-user';

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
    ],
    host: 'localhost',
    logging: false,
    password: 'postgres_password',
    port: 5432,
    synchronize: true,
    type: 'postgres',
    username: 'postgres',
  });
  const us = await connection.manager.save(createUser());
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
  // console.log(resuser);

  await getCustomRepository(RegionRepository).find();
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
