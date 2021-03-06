jest.useFakeTimers();
import express from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection, getRepository } from 'typeorm';

import routes from '../../../src/lib/routes';

import path from 'path';
import { UserRole } from '../../../src/lib/common';
import { User } from '../../../src/orm/entity/User';
import {
  closeTestingConnections,
  createTestingConnections,
  readTokenFromDisc,
  reloadTestingDatabases,
} from '../../test-utils';
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

describe('testing get users', () => {
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

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/v1/', routes);

  test('default route', async (done) => {
    const res = await request(app)
      .get('/api/v1/')
      .set(headers);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    done();
  });

  test('route get users', async (done) => {
    // expect.assertions(2);
    const res = await request(app)
      .get('/api/v1/users')
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    // expect(res.body[0]).toHaveProperty('email');
    // expect(res.body[0]).toHaveProperty('firstName');
    // expect(res.body[0]).toHaveProperty('lastName');
    // expect(res.body[0]).toHaveProperty('role');
    done();
  });
  test('route get users by auth0id', async (done) => {
    const user = new User();
    const repo = getRepository('user');
    const auth0Id = 'auth0|123456';
    repo.merge(user, {
      firstName: 'bah',
      lastName: 'foo',
      email: 'foo@bah.org',
      protected: false,
      auth0Id,
      role: UserRole.reporter,
    });
    await repo.save(user);
    const res = await request(app)
      .get(`/api/v1/users?auth0Id=${auth0Id}`)
      .set(headers);
    expect(res.status).toBe(200);
    // console.log(res.body);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].auth0Id).toEqual(auth0Id);
    // expect(res.body[0]).toHaveProperty('email');
    // expect(res.body[0]).toHaveProperty('firstName');
    // expect(res.body[0]).toHaveProperty('lastName');
    // expect(res.body[0]).toHaveProperty('role');
    done();
  });
  test('route get user by id', async (done) => {
    expect.assertions(2);
    const res = await request(app)
      .get('/api/v1/users/1')
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });

  test('route get user should fail due to worng id', async (done) => {
    expect.assertions(2);
    const res = await request(app)
      .get(`/api/v1/users/${100000}`)
      .set(headers);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    done();
  });
});
