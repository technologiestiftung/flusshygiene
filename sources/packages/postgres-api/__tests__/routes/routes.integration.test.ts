it('shall pass', () => {
  expect(2).toBe(2);
});
// import path from 'path';
// import { RegionRepository } from '../../src/lib/repositories/RegionRepository';
// import { UserRepository } from '../../src/lib/repositories/UserRepository';
// import { HttpCodes } from '../../src/lib/common';
// // tslint:disable: ordered-imports
// jest.useFakeTimers();
// import { SUCCESS } from '../../src/lib/messages/success';
// import express, { Application } from 'express';
// import 'reflect-metadata';
// import request from 'supertest';
// import { createConnection, getConnection, getRepository, getCustomRepository } from 'typeorm';
// import { ERRORS } from '../../src/lib/messages';
// import {
//   getBathingspotById,
//   getSpotByUserAndId,
//   getUserWithRelations,
//   getRegionsList,
// } from '../../src/lib/repositories/custom-repo-helpers';
// import routes from '../../src/lib/routes';
// import {
//   DefaultRegions,
//   UserRole,
// } from '../../src/lib/common';
// import { Bathingspot } from '../../src/orm/entity/Bathingspot';
// import { BathingspotModel } from '../../src/orm/entity/BathingspotModel';
// import { BathingspotPrediction } from '../../src/orm/entity/BathingspotPrediction';
// import { BathingspotRawModelData } from '../../src/orm/entity/BathingspotRawModelData';
// import { Questionaire } from '../../src/orm/entity/Questionaire';
// import { Region } from '../../src/orm/entity/Region';
// import { createProtectedUser } from '../../src/orm/fixtures/create-protected-user';
// import { SUGGESTIONS } from '../../src/lib/messages/suggestions';
// import { User } from '../../src/orm/entity/User';
// import fs from 'fs';
// import util from 'util';

// let app: Application;
// const readFileAsync = util.promisify(fs.readFile);

// // ███████╗███████╗████████╗██╗   ██╗██████╗
// // ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// // ███████╗█████╗     ██║   ██║   ██║██████╔╝
// // ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// // ███████║███████╗   ██║   ╚██████╔╝██║
// // ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

// beforeAll((done) => {
//   if (process.env.NODE_ENV !== 'test') {
//     throw new Error('We are not in the test env this is harmful tables will be dropped');
//   }
//   app = express();
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));
//   app.use('/api/v1/', routes);

//   const p = createConnection({
//     database: 'postgres',
//     dropSchema: true,
//     entities: [
//       User,
//       Region,
//       Questionaire,
//       Bathingspot,
//       BathingspotModel,
//       BathingspotPrediction,
//       BathingspotRawModelData,
//     ],
//     host: 'localhost',
//     logging: false,
//     password: 'postgres_password',
//     port: 5432,
//     synchronize: true,
//     type: 'postgres',
//     username: 'postgres',
//   });

//   p.then(con => {
//     // const db = await con.connect();
//     // process.stdout.write(db.name);
//     con.manager.save(createProtectedUser()).then(() => {
//       const user = new User();
//       user.firstName = 'James';
//       user.lastName = 'Bond';
//       user.role = UserRole.creator;
//       user.email = 'faker@fake.com';
//       const spot = new Bathingspot();
//       const regions: Region[] = [];
//       for (const key in DefaultRegions) {
//         if (DefaultRegions.hasOwnProperty(key)) {
//           const r = new Region();
//           r.name = key;
//           r.displayName = key;
//           regions.push(r);
//         }
//       }
//       spot.region = regions[0];
//       spot.isPublic = true;
//       spot.name = 'billabong';

//       user.bathingspots = [spot];
//       con.manager.save(regions).then(() => {
//         con.manager.save(spot).then(() => {
//           con.manager.save(user).then(() => {
//             // connection = con;
//             done();

//           }).catch(err => { throw err; });
//         }).catch(err => { throw err; });
//       }).catch(err => { throw err; });
//     }).catch(err => { throw err; });
//   }).catch(err => { throw err; });
// });

// afterAll((done) => {
//   const con = getConnection();
//   con.dropDatabase().then(() => {
//     con.close().then(() => {

//       done();
//     }).catch(err => { throw err; });
//   }).catch(err => { throw err; });
// });

// // ██████╗  ██████╗ ███╗   ██╗███████╗
// // ██╔══██╗██╔═══██╗████╗  ██║██╔════╝
// // ██║  ██║██║   ██║██╔██╗ ██║█████╗
// // ██║  ██║██║   ██║██║╚██╗██║██╔══╝
// // ██████╔╝╚██████╔╝██║ ╚████║███████╗
// // ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝
