jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection, getCustomRepository } from 'typeorm';
import {
  getRegionsList,
} from '../../../src/lib/repositories/custom-repo-helpers';
import { RegionRepository } from '../../../src/lib/repositories/RegionRepository';
import routes from '../../../src/lib/routes';
import {
  DefaultRegions,
} from '../../../src/lib/types-interfaces';
import { Region } from '../../../src/orm/entity/Region';
import {
  closeTestingConnections,
  createTestingConnections,
  reloadTestingDatabases,
} from '../../test-utils';

// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

describe('testing get users', () => {
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
  //     console.warn(err.stack);
  //   }
  // });
  afterAll(async (done) => {
    try {
      await reloadTestingDatabases(connections);
      await closeTestingConnections(connections);
      done();
    } catch (err) {
      console.warn(err.message);
      console.warn(err.stack);
      throw err;
    }
  });

  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/v1/', routes);

  test.skip('route should fail due to wrong route', async (done) => {
    expect.assertions(2);
    const res = await request(app).get('/api/v1/');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    done();
  });

  test('route get users', async (done) => {
    // expect.assertions(2);
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    // expect(res.body[0]).toHaveProperty('email');
    // expect(res.body[0]).toHaveProperty('firstName');
    // expect(res.body[0]).toHaveProperty('lastName');
    // expect(res.body[0]).toHaveProperty('role');
    done();
  });

  test('route get user by id', async (done) => {
    expect.assertions(2);
    const res = await request(app).get('/api/v1/users/1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });

  test('route get user should fail due to worng id', async (done) => {
    expect.assertions(2);
    const res = await request(app).get(`/api/v1/users/${100000}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    done();
  });
});
