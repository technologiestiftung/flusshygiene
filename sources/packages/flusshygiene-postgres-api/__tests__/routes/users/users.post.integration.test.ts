jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection } from 'typeorm';
import routes from '../../../src/lib/routes';
import {
  DefaultRegions, UserRole,
} from '../../../src/lib/types-interfaces';
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

describe('testing post users', () => {
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

  test('add user', async (done) => {
  // process.env.NODE_ENV = 'development';

  const res = await request(app).post('/api/v1/users').send({
    email: 'lilu@fifth-element.com',
    firstName: 'Lilu',
    lastName: 'Mulitpass',
    role: UserRole.reporter,
  })
    .set('Accept', 'application/json');
  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  done();
});

  test('add user creator (should have a region set)', async (done) => {
  // process.env.NODE_ENV = 'development';
  const res = await request(app).post('/api/v1/users').send({
    email: 'baz@bong.com',
    firstName: 'Me',
    lastName: 'You',
    region: DefaultRegions.berlin,
    role: UserRole.creator,
  })
    .set('Accept', 'application/json');
  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  expect(Array.isArray(res.body.data)).toBe(true);
  done();
});
  test('add user shoud fail due to missing values', async () => {
  expect.assertions(1);
  const res = await request(app).post('/api/v1/users').send({
  })
    .set('Accept', 'application/json');
  expect(res.status).toBe(404);
});

  test('add user shoud fail due to missing firstName', async () => {
  expect.assertions(1);
  const res = await request(app).post('/api/v1/users').send({
    email: 'lilu@fifth-element.com',
    lastName: 'Mulitpass',
    role: 'reporter',
  })
    .set('Accept', 'application/json');
  expect(res.status).toBe(404);
});

  test('add user shoud fail due to missing lastName', async () => {
  expect.assertions(1);
  const res = await request(app).post('/api/v1/users').send({
    email: 'lilu@fifth-element.com',
    firstName: 'Lilu',
    role: 'reporter',
  })
    .set('Accept', 'application/json');
  expect(res.status).toBe(404);
});
  test('add user shoud fail due to missing email', async () => {
  expect.assertions(1);
  const res = await request(app).post('/api/v1/users').send({
    firstName: 'Lilu',
    lastName: 'Mulitpass',
    role: 'reporter',
  })
    .set('Accept', 'application/json');
  expect(res.status).toBe(404);
});

  test('add user shoud fail due to missing role', async () => {
  expect.assertions(1);
  const res = await request(app).post('/api/v1/users').send({
    email: 'lilu@fifth-element.com',
    firstName: 'Lilu',
    lastName: 'Mulitpass',
  })
    .set('Accept', 'application/json');
  expect(res.status).toBe(404);
});
});
