/**
 * Use this layout for creating new integration tests
 * that use the API auth0 authentification
 */
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
import * as path from 'path';

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
  Accept: 'application/json',
  authorization: `${token.token_type} ${token.access_token}`,
};

const userData = {
  firstName: 'foo',
  role: 'creator',
  email: 'foo@Bathingspot.com',
  lastName: 'bah',
};
const spotData = { name: 'foo', isPublic: true };
describe('Testing generic inputs', () => {
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

  test('generic inputs to spot of user', async (done) => {
    const userRes = await request(app)
      .post(`/api/v1/users`)
      .send(userData)
      .set(headers);
    const user = userRes.body.data[0];

    const spotRes = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots`)
      .send(spotData)
      .set(headers);

    const spot = spotRes.body.data[0];

    // -------

    const resGet = await request(app)
      .get(`/api/v1/users/${user.id}/bathingspots/${spot.id}/genericInputs`)
      .set(headers);

    const resPost = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots/${spot.id}/genericInputs`)
      .send({ name: 'foo' })
      .set(headers);

    const gi = resPost.body.data[0];

    const resPut = await request(app)
      .put(
        `/api/v1/users/${user.id}/bathingspots/${spot.id}/genericInputs/${gi.id}`,
      )
      .send({ name: `${gi.name}-edit` })
      .set(headers);

    const resGetPut = await request(app)
      .get(
        `/api/v1/users/${user.id}/bathingspots/${spot.id}/genericInputs/${gi.id}`,
      )
      .send({ name: `${gi.name}-edit` })
      .set(headers);

    const resPutErr = await request(app)
      .put(
        `/api/v1/users/${user.id}/bathingspots/${
          spot.id
        }/genericInputs/${'fooo'}`,
      )
      .send({ name: `${gi.name}-edit` })
      .set(headers);

    const resDel = await request(app)
      .delete(
        `/api/v1/users/${user.id}/bathingspots/${spot.id}/genericInputs/${gi.id}`,
      )
      .set(headers);

    expect(resGet.status).toBe(200);
    expect(resGetPut.status).toBe(200);
    expect(resPost.status).toBe(201);
    expect(resPut.status).toBe(201);
    expect(resDel.status).toBe(200);
    expect(resPutErr.status).toBe(404);

    expect(Array.isArray(resGet.body.data)).toBe(true);
    expect(resGet.body.data.length).toBe(0);
    expect(resPost.body.data.length).toBe(1);
    expect(resGetPut.body.data[0].name).toMatch(`${gi.name}-edit`);

    done();
  });
});
