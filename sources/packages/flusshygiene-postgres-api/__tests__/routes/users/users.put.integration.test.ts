jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection, getCustomRepository } from 'typeorm';
import { UserRepository } from '../../../src/lib/repositories/UserRepository';
import routes from '../../../src/lib/routes';
import { DefaultRegions, UserRole } from '../../../src/lib/common';
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


describe('testing put users', () => {
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

  test('update user', async (done) => {
  // process.env.NODE_ENV = 'development';
  // expect.assertions(2);
  const usersres = await request(app).get('/api/v1/users').set(headers);
  // console.log(usersres);
  const id = usersres.body.data[usersres.body.data.length - 1].id;
  const res = await request(app).put(`/api/v1/users/${id}`).send({
    email: 'foo@test.com',
  })
    .set(headers);
  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  expect(Array.isArray(res.body.data)).toBe(true);
  done();
});

  test.skip('update user', async (done) => {
  const newUserRes = await request(app).post(`/api/v1/users/`).send({
    email: 'boom@test.com',
    firstName: 'boom',
    lastName: 'test',
    region: DefaultRegions.niedersachsen,
    role: UserRole.creator,
  })
    .set(headers);
  // console.log(newUserRes.body);
  // const usersres = await request(app).get('/api/v1/users');
  // const id = usersres.body.data[usersres.body.data.length - 1].id;
  await request(app).post(`/api/v1/users/${newUserRes.body.data[0].id}/bathingspots`).send({
    isPublic: false,
    name: 'intermidiante spot',
  }).set(headers);

  const res = await request(app).put(
    `/api/v1/users/${newUserRes.body.data[0].id}`).send({
            email: 'foo@test.com',
            region: DefaultRegions.niedersachsen,
          })
            .set(headers);

  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  expect(Array.isArray(res.body.data)).toBe(true);
  await request(app).delete(`/api/v1/users/${newUserRes.body.data[0].id}`);
  done();
});

  test('user fail due to undefiend user id', async (done) => {
  const userRepo = getCustomRepository(UserRepository);
  // const usersWithRelations = await userRepo.find({relations: ['bathingspots']});

  // console.log(usersWithRelations);
  const res = await request(app).put(
    `/api/v1/users/${1000}`).set(headers);
  expect(res.status).toBe(404);
  // console.log(res.body);
  expect(res.body.success).toBe(false);
  // expect(res.body.data.length).toBe(0);
  done();
});
  test('user fail due to wrong route', async (done) => {
  const userRepo = getCustomRepository(UserRepository);
  // const usersWithRelations = await userRepo.find({relations: ['bathingspots']});

  // console.log(usersWithRelations);
  const res = await request(app).put(
    `/api/v1/users/`).set(headers);
  expect(res.status).toBe(404);
  // console.log(res.body);
  // expect(res.body.success).toBe(false);
  // expect(res.body.data.length).toBe(0);
  done();
});
});
