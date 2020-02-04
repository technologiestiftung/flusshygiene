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

describe('Testing bathingspot limits', () => {
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

  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
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

  test('get bathingspots with limit', async (done) => {
    const ures = await request(app)
      .post('/api/v1/users')
      .send({
        firstName: 'foo',
        lastName: 'bah',
        role: 'creator',
        email: 'foo@bah.com',
      })
      .set(headers);
    // console.log(ures.body.data);
    const user = ures.body.data[0];

    const res500_1 = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots/`)
      .send({ name: 'foo', isPublic: true, influencePurificationPlant: 'foo' })
      .set(headers);
    const res500_2 = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots/`)
      .send({
        name: 'foo',
        isPublic: true,
        influenceCombinedSewerSystem: 'foo',
      })
      .set(headers);
    const res500_3 = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots/`)
      .send({ name: 'foo', isPublic: true, influenceRainwater: 'foo' })
      .set(headers);
    const res500_4 = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots/`)
      .send({ name: 'foo', isPublic: true, influenceAgriculture: 'foo' })
      .set(headers);

    const res201no = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots/`)
      .send({ name: 'foo', isPublic: true, influencePurificationPlant: 'no' })
      .set(headers);
    const res201yes = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots/`)
      .send({ name: 'foo', isPublic: true, influencePurificationPlant: 'yes' })
      .set(headers);
    const res201unknown = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots/`)
      .send({
        name: 'foo',
        isPublic: true,
        influencePurificationPlant: 'unknown',
      })
      .set(headers);
    // console.log(res500.status);

    expect(res500_1.status).toBe(500);
    expect(res500_2.status).toBe(500);
    expect(res500_3.status).toBe(500);
    expect(res500_4.status).toBe(500);
    // expect(console.error).toHaveBeenCalledTimes(8);
    expect(res201no.status).toBe(201);
    expect(res201yes.status).toBe(201);
    expect(res201unknown.status).toBe(201);
    done();
  });
});
