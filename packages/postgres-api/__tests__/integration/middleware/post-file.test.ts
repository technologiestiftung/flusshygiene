jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection } from 'typeorm';
import routes from '../../../src/lib/routes';
import {
  closeTestingConnections,
  createTestingConnections,
  reloadTestingDatabases,
  readTokenFromDisc,
} from '../../test-utils';
import path from 'path';
import { UserRole } from '../../../src/lib/common';

// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

const token = readTokenFromDisc(
  path.resolve(__dirname, '../../.test.token.json'),
);
const headers = {
  authorization: `${token.token_type} ${token.access_token}`,
  Accept: 'application/json',
};
describe('testing postFileMiddleware', () => {
  let app: Application;
  let connections: Connection[];

  beforeAll(async (done) => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error(
        'We are not in the test env this is harmful tables will be dropped',
      );
    }
    connections = await createTestingConnections();
    done();
  });

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

  test('should return 404 due to missing wrong user', async (done) => {
    const res = await request(app)
      .post(
        `/api/v1/users/${10000}/bathingspots/${1000000}/models/${2000000}/upload/rmodel`,
      )
      .set(headers);
    expect(res.status).toBe(404);
    done();
  });

  test('should return 404 due to missing wrong spot', async (done) => {
    const userRes = await request(app)
      .post(`/api/v1/users/`)
      .send({
        email: 'lilu@fifth-element.com',
        firstName: 'Lilu',
        lastName: 'Mulitpass',
        role: UserRole.creator,
        protected: true,
      })
      .set(headers);
    const res = await request(app)
      .post(
        `/api/v1/users/${
          userRes.body.data[0].id
        }/bathingspots/${1000000}/models/${2000000}/upload/rmodel`,
      )
      .set(headers);
    expect(res.status).toBe(404);
    done();
  });
});
