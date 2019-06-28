import { Bathingspot } from './../../../src/orm/entity/Bathingspot';
jest.useFakeTimers();
import express, { Application } from 'express';
import * as path from 'path';
import 'reflect-metadata';
import request from 'supertest';
import { Connection, getRepository } from 'typeorm';
import { ERRORS, SUGGESTIONS } from '../../../src/lib/messages';
import routes from '../../../src/lib/routes';
import { User } from '../../../src/orm/entity/User';
import {
  closeTestingConnections,
  createTestingConnections,
  readFileAsync,
  reloadTestingDatabases,
  readTokenFromDisc,

} from '../../test-utils';
// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

const token = readTokenFromDisc(path.resolve(__dirname, '../../.test.token.json'));
const headers = { authorization: `${token.token_type} ${token.access_token}`,Accept: 'application/json' };

describe('testing users/bathingspot PUT', () => {
  let app: Application;
  let connections: Connection[];

  beforeAll(async (done) => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('We are not in the test env this is harmful tables will be dropped');
    }
    connections = await createTestingConnections();
    done();
  });
  // beforeEach(async (done) => {
  //   try {
  //     await reloadTestingDatabases(connections);
  //     done();
  //   } catch (err) {
  //     console.warn(err.message);
  //   }
  // });
  afterAll(async (done) => {
    try {
      await reloadTestingDatabases(connections);
      await closeTestingConnections(connections);
      done();
    } catch (err) {
      console.warn(err.message);
      throw err;
    }
  });

  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/v1/', routes);

// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

// ██████╗  ██████╗ ███╗   ██╗███████╗
// ██╔══██╗██╔═══██╗████╗  ██║██╔════╝
// ██║  ██║██║   ██║██╔██╗ ██║█████╗
// ██║  ██║██║   ██║██║╚██╗██║██╔══╝
// ██████╔╝╚██████╔╝██║ ╚████║███████╗
// ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝

  test('should fail due to wrong id of a bathingspot', async (done) => {
  const userRepo = getRepository(User);
  const usersAndSpots = await userRepo.find({ relations: ['bathingspots'] });
  const usersWithSpots = usersAndSpots.filter(u => u.bathingspots.length > 0);
  const user = usersWithSpots[0];

  const res = await request(app).put(`/api/v1/users/${user.id}/bathingspots/${10000}`).send({
    name: 'watering hole',
  }).set(headers);

  expect(res.status).toBe(404);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toEqual(ERRORS.badRequestMissingOrWrongID404);
  done();
});

  test('should change the name of a bathingspot', async (done) => {
  const userRepo = getRepository(User);
  const spotRepo = getRepository(Bathingspot);
  const usersAndSpots = await userRepo.find({ relations: ['bathingspots'] });
  const usersWithSpots = usersAndSpots.filter(u => u.bathingspots.length > 0);
  const user = usersWithSpots[0];
  const spot = user.bathingspots[0];
  const res = await request(app).put(`/api/v1/users/${user.id}/bathingspots/${spot.id}`).send({
    name: 'watering hole',
  }).set(headers);
  const spotAgain: Bathingspot | undefined = await spotRepo.findOne(spot.id);
  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data[0].name).toEqual('watering hole');
  expect(spotAgain.name).toEqual('watering hole');
  done();
});

  test('should set all the fields of a bathingspot', async (done) => {
  const jsonStringPolygon = await readFileAsync(path.resolve(__dirname, '../../data/polygon.json'), 'utf8');
  const jsonStringPoint = await readFileAsync(path.resolve(__dirname, '../../data/point.json'), 'utf8');
  const polygon = JSON.parse(jsonStringPolygon);
  const point = JSON.parse(jsonStringPoint);
  const userRepo = getRepository(User);
  // const spotRepo = getRepository(Bathingspot);
  const usersAndSpots = await userRepo.find({ relations: ['bathingspots'] });
  const usersWithSpots = usersAndSpots.filter(u => u.bathingspots.length > 0);
  const user = usersWithSpots[0];
  const spot = user.bathingspots[0];
  const res = await request(app).put(`/api/v1/users/${user.id}/bathingspots/${spot.id}`).send({
    apiEndpoints: {},
    area: polygon,
    elevation: 1,
    isPublic: true,
    latitude: 13,
    location: point,
    longitude: 52,
    name: 'Sweetwater',
    state: {},
  }).set(headers);

  // console.log(res.body);

  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data[0].name).toEqual('Sweetwater');
  done();
});

  test('should reject the change due to wrong fields but present an example', async (done) => {
  const userRepo = getRepository(User);
  // const spotRepo = getRepository(Bathingspot);
  const usersAndSpots = await userRepo.find({ relations: ['bathingspots'] });
  // const usersAndSpots = await userRepo.createQueryBuilder('user')
  // .leftJoinAndSelect('user.bathingspots', 'bathingspots')
  //   .getMany();
  const usersWithSpots = usersAndSpots.filter(_user => _user.bathingspots.length > 0);

  const user = usersWithSpots[0];
  const spot = user.bathingspots[0];
  const res = await request(app).put(`/api/v1/users/${user.id}/bathingspots/${spot.id}`).send({
  }).set(headers);
  expect(res.status).toBe(404);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBe(SUGGESTIONS.missingFields);
  done();
});
});
