import { UserRole } from './../../../src/lib/types-interfaces';
jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection, getCustomRepository, getRepository } from 'typeorm';
import { UserRepository } from '../../../src/lib/repositories/UserRepository';
import routes from '../../../src/lib/routes';
import { User } from '../../../src/orm/entity/User';
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

  test('should delete a users', async (done) => {
  // process.env.NODE_ENV = 'development';
  // const usersres = await request(app).get('/api/v1/users');
  const userRepo = getRepository(User);
  await userRepo.insert({
    email: 'foo@bah.com',
    firstName: 'Jimmy',
    lastName: 'Stash',
    protected: false,
    role: UserRole.creator,
 });
  const user = await userRepo.findOne({where: {firstName: 'Jimmy'}});
  // console.log(users);
  const id = user.id;

  const res = await request(app).delete(`/api/v1/users/${id}`);
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  done();
});
  test('delete user should fail due to missing id', async (done) => {
  const res = await request(app).delete(`/api/v1/users`);

  expect(res.status).toBe(404);
  done();
});
  test('delete user should fail due to wrong id', async (done) => {
  const res = await request(app).delete(`/api/v1/users/${10000000}`);
  expect(res.status).toBe(404);
  done();
});

  test('should delete user even if he has spots', async (done) => {
  // process.env.NODE_ENV = 'development';
  const userRepo = getCustomRepository(UserRepository);
  const usersWithRelations = await userRepo.find({
    relations: ['bathingspots'],
    where: {protected: false},
  });
  const res = await request(app).delete(
    `/api/v1/users/${usersWithRelations[0].id}`);

  // console.log(res.body);
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  // expect(res.body.data.length).toBe(0);
  done();
});
  test('should fail. Can\'t delete protected user', async (done) => {
  const userRepo = getCustomRepository(UserRepository);
  const usersWithRelations = await userRepo.find({relations: ['bathingspots'], where: {protected: true}});

  // console.log(usersWithRelations);
  const res = await request(app).delete(
    `/api/v1/users/${usersWithRelations[0].id}`);
  expect(res.status).toBe(403);
  // console.log(res.body);
  expect(res.body.success).toBe(false);
  // expect(res.body.data.length).toBe(0);
  done();
});
});
