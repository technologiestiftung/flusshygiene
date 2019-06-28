import { User } from './../../../src/orm/entity/User';
jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection, getCustomRepository } from 'typeorm';
import { UserRepository } from '../../../src/lib/repositories/UserRepository';
import routes from '../../../src/lib/routes';
import { DefaultRegions } from '../../../src/lib/common';
import {
  closeTestingConnections,
  createTestingConnections,
  reloadTestingDatabases,
  readTokenFromDisc,
} from '../../test-utils';
import path from 'path';
// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

const token = readTokenFromDisc(path.resolve(__dirname, '../../.test.token.json'));
const headers = { authorization: `${token.token_type} ${token.access_token}`,Accept: 'application/json' };

describe('testing users/[:userId]/bathingspots/[:spotId]', () => {
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

  test('should return at least an empty array of bathingspots', async (done) => {
    const userRepo = getCustomRepository(UserRepository);
    const users = await userRepo.find();
    const res = await request(app).get(`/api/v1/users/${users[0].id}/bathingspots`).set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });

  test('user should have a bathingspot', async (done) => {
    const userWithSpotsCount = await connections[0].manager
    .createQueryBuilder(User, 'user').loadRelationCountAndMap('user.bathingspotCount', 'user.bathingspots').getMany();
    interface IUserwithSpotCount extends User {
      bathingspotCount: number;
    }
    const usersWithSpots = userWithSpotsCount.filter((u: IUserwithSpotCount) => u.bathingspotCount > 0);

    const res = await request(app).get(`/api/v1/users/${usersWithSpots[0].id}/bathingspots`).set(headers);
    expect(res.status).toBe(200);
    expect(res.body.data.length >= 1).toBe(true);
    done();
  });

  test('user should have no bathingspot in region', async (done) => {
    const res = await request(app).get(`/api/v1/users/2/bathingspots/${DefaultRegions.schleswigholstein}`).set(headers);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
    done();
  });

  test.skip('user should have a bathingspot with id', async (done) => {
    const userRepo = getCustomRepository(UserRepository);
    const usersWithRelations = await userRepo.find({ relations: ['bathingspots'] });

    // console.log(usersWithRelations);
    const res = await request(app).get(
      `/api/v1/users/${usersWithRelations[0].id}/bathingspots/${usersWithRelations[0].bathingspots[0].id}`).set(headers);
    expect(res.status).toBe(200);
    // console.log(res.body);
    expect(res.body.data.length > 0).toBe(true);
    done();
  });
  test('region should not exist', async (done) => {
    const userRepo = getCustomRepository(UserRepository);
    const usersWithRelations = await userRepo.find({ relations: ['bathingspots'] });

    // console.log(usersWithRelations);
    const res = await request(app).get(
      `/api/v1/users/${usersWithRelations[0].id}/bathingspots/foo`).set(headers);
    expect(res.status).toBe(404);
    // console.log(res.body);
    expect(res.body.success).toBe(false);
    done();
  });
  test('user should have no bathingspot in region', async (done) => {
    const userRepo = getCustomRepository(UserRepository);
    const usersWithRelations = await userRepo.find({ relations: ['bathingspots'] });

    // console.log(usersWithRelations);
    const res = await request(app).get(
      `/api/v1/users/${usersWithRelations[0].id}/bathingspots/${DefaultRegions.schleswigholstein}`).set(headers);
    expect(res.status).toBe(200);
    // console.log(res.body);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(0);
    done();
  });
  test('should fail due to wrong user id', async (done) => {
    const res = await request(app).get(`/api/v1/users/${10000}/bathingspots`).set(headers);
    expect(res.status).toBe(404);
    expect(res.body.data).toBeUndefined();
    expect(res.body.success).toBe(false);
    done();
  });
  test('should fail due to wrong bathingspot id', async (done) => {
    const res = await request(app).get(`/api/v1/users/${2}/bathingspots/${10000}`).set(headers);
    expect(res.status).toBe(404);
    expect(res.body.data).toBeUndefined();
    expect(res.body.success).toBe(false);
    done();
  });
});
