jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection } from 'typeorm';
import routes from '../../../src/lib/routes';
import { DefaultRegions, HttpCodes } from '../../../src/lib/types-interfaces';
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

describe('testing get bathingspots', () => {
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

  test.skip('route should fail due to wrong route', async (done) => {
  expect.assertions(2);
  const res = await request(app).get('/api/v1/');
  expect(res.status).toBe(404);
  expect(res.body.success).toBe(false);
  done();
});

  test('route get bathingspots', async (done) => {
  expect.assertions(2);
  const res = await request(app).get('/api/v1/bathingspots');

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  done();
});

  test('route get bathingspot by id', async (done) => {
  // expect.assertions(2);
  const res = await request(app).get('/api/v1/bathingspots/1');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  done();
});

  test('route get single bathingspot should fail due to worng id', async (done) => {
  // expect.assertions(2);
  const res = await request(app).get(`/api/v1/bathingspots/${100000}`);
  expect(res.status).toBe(404);
  expect(res.body.success).toBe(false);
  done();
});
  test('should fail due to wrong spot region id', async (done) => {
  const res = await request(app).get(`/api/v1/bathingspots/foo`);
  expect(res.status).toBe(HttpCodes.badRequestNotFound);
  expect(res.body.success).toBe(false);
  done();
});
  test('should return empty spot array', async (done) => {
  const res = await request(app).get(`/api/v1/bathingspots/${DefaultRegions.schleswigholstein}`);
  expect(res.status).toBe(HttpCodes.success);
  expect(res.body.success).toBe(true);
  expect(res.body.data.length).toBe(0);
  done();
});
});
