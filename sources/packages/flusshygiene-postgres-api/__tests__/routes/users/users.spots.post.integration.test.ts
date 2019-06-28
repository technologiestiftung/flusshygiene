import { HttpCodes } from './../../../src/lib/common';
jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection, getCustomRepository, getRepository } from 'typeorm';
import { ERRORS, SUGGESTIONS } from '../../../src/lib/messages';
import { UserRepository } from '../../../src/lib/repositories/UserRepository';
import routes from '../../../src/lib/routes';
import { DefaultRegions, UserRole } from '../../../src/lib/common';
import { Bathingspot } from '../../../src/orm/entity/Bathingspot';
import { User } from '../../../src/orm/entity/User';
import path from 'path';
import {
  closeTestingConnections,
  createTestingConnections,
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

describe('testing bathingspots post for a specific user', () => {
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

  test.skip('should fail due to missing isPublic values', async (done) => {

    const userRepo = getRepository(User);
    const users: User[] = await userRepo.find({ relations: ['bathingspots'], where: { role: UserRole.creator } });
    // console.log(users);
    const user: User = users[0]; // last created user
    const id = user.id;

    const res = await request(app).post(`/api/v1/users/${id}/bathingspots`).send({
      apiEndpoints: {},
      elevation: 1,
      /*isPublic: true,*/
      latitude: 13,
      location: {},
      longitude: 52,
      name: 'Sweetwater',
      state: {},
    }).set(headers);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(SUGGESTIONS.missingFields);
    done();
  });

  test.skip('should fail due to wrong isPublic type', async () => {
    const userRepo = getRepository(User);
    const user: User = await userRepo.findOne({ where: { role: UserRole.creator } });
    const id = user.id;
    const res = await request(app).post(`/api/v1/users/${id}/bathingspots`).send({
      isPublic: 'foo',
      name: 'will fail',
    });
    expect(res.status).toBe(HttpCodes.badRequest);
    expect(res.body.success).toBe(false);
  });
  test('should fail due to wrong user id', async (done) => {

    const res = await request(app).post(`/api/v1/users/${100000}/bathingspots`).send({
      apiEndpoints: {},
      elevation: 1,
      isPublic: true,
      latitude: 13,
      location: {},
      longitude: 52,
      name: 'Sweetwater',
      state: {},
    }).set(headers);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(ERRORS.badRequestMissingOrWrongID404);
    done();
  });

  test('should fail due to wrong user role', async (done) => {
    const userRepo = getCustomRepository(UserRepository);
    const usersWithRole = await userRepo.findAllByRole(UserRole.reporter);
    const res = await request(app).post(`/api/v1/users/${usersWithRole[0].id}/bathingspots`).send({
      apiEndpoints: {},
      elevation: 1,
      isPublic: true,
      latitude: 13,
      location: {},
      longitude: 52,
      name: 'Sweetwater',
      state: {},
    }).set(headers);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(ERRORS.badRequestUserNotAuthorized);
    done();
  });

  test('should add bathingspot to user', async (done) => {
    const userRepo = getRepository(User);
    const users: User[] = await userRepo.find({ where: { role: UserRole.creator }, relations: ['bathingspots'] });
    const user: User = users[users.length - 1]; // last created user
    // console.log(users);
    const id = user.id;
    const spots = user.bathingspots;

    const res = await request(app).post(`/api/v1/users/${id}/bathingspots`).send({
      apiEndpoints: {},
      elevation: 1,
      isPublic: true,
      latitude: 13,
      location: {}, // <-- will produce an error
      longitude: 52,
      name: 'Sweetwater',
      region: DefaultRegions.berlin,
      state: {},
    }).set(headers);
    const againUser: User | undefined = await userRepo.findOne(id, { relations: ['bathingspots'] });
    if (againUser !== undefined) {
      const againSpots: Bathingspot[] | undefined = againUser.bathingspots;
      if (againSpots !== undefined) {
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(againSpots.length).toBe(spots.length + 1);
      } else {
        throw new Error();
      }
    } else {
      throw new Error();
    }
    done();
  });
});
