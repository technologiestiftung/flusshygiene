import { UserRole } from './../../../src/lib/common';
jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection, getRepository } from 'typeorm';
import routes from '../../../src/lib/routes';
import { User } from '../../../src/orm/entity/User';
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


describe('testing delete users', () => {
  let app: Application;
  let connections: Connection[];

  beforeAll(async (done) => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('We are not in the test env this is harmful tables will be dropped');
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

  test('should delete a users', async (done) => {
  const userRepo = getRepository(User);
  await userRepo.insert({
    email: 'foo@bah.com',
    firstName: 'Jimmy',
    lastName: 'Stash',
    protected: false,
    role: UserRole.creator,
 });
  const user = await userRepo.findOne({where: {firstName: 'Jimmy'}});
  const id = user.id;

  const res = await request(app).delete(`/api/v1/users/${id}`).set(headers);
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  done();
});
  test('delete user should fail due to missing id', async (done) => {
  const res = await request(app).delete(`/api/v1/users`).set(headers);

  expect(res.status).toBe(404);
  done();
});
  test('delete user should fail due to wrong id', async (done) => {
  const res = await request(app).delete(`/api/v1/users/${10000000}`).set(headers);
  expect(res.status).toBe(404);
  done();
});

  test('should delete user even if he has spots', async (done) => {
  const userRepo = getRepository(User);
  const usersWithRelations = await userRepo.find({
    relations: ['bathingspots'],
    where: {protected: false},
  });
  const res = await request(app)
  .delete(
    `/api/v1/users/${usersWithRelations[0].id}`)
    .set(headers);
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  done();
});
  test('should fail. Can\'t delete protected user', async (done) => {
  const userRepo = getRepository(User);
  const usersWithRelations = await userRepo.find({relations: ['bathingspots'], where: {protected: true}});

  const res = await request(app)
  .delete(
    `/api/v1/users/${usersWithRelations[0].id}`)
    .set(headers);
  expect(res.status).toBe(403);
  expect(res.body.success).toBe(false);
  done();
});
});
