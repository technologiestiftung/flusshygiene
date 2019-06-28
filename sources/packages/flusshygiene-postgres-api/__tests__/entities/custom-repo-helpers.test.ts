import { User } from './../../src/orm/entity/User';
jest.useFakeTimers();
// import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection } from 'typeorm';
// import routes from '../../src/lib/routes';
import {
  closeTestingConnections,
  createTestingConnections,
  reloadTestingDatabases,
} from '../test-utils';
import { getRegionByName, getBathingspotByIdWithRelations, getRegionsList, getSpotByUserAndId, getBathingspotById, getUserWithRelations } from '../../src/lib/utils/custom-repo-helpers';
import { Region, Bathingspot } from '../../src/orm/entity';

// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

describe('misc helper functions for repositories', () => {
  // let app: Application;
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

  // app = express();
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));
  // app.use('/api/v1/', routes);

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

  test('should get region berlin', async (done) => {
    const res = await getRegionByName('berlin');
    expect(res.constructor.name).toBe('Region');
    expect(res.name).toBe('berlin');

    // expect(typeof res).toBe(Region);
    // const res = await request(app).get('/api/v1/users/');
    // expect(res.status).toBe(200);
    // expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('region should not exists', async (done) => {
    const res = await getRegionByName('foo');
    expect(res).toBe(undefined);
    done();
  });

  test('should get a bathingspot ', async (done) => {
    const res = await getBathingspotByIdWithRelations(1, ['rains']) as Bathingspot;
    expect(res.constructor.name).toBe('Bathingspot');
    expect(res.rains.length).toBe(0);

    // expect(typeof res).toBe(Region);
    // const res = await request(app).get('/api/v1/users/');
    // expect(res.status).toBe(200);
    // expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });

  test('should get a list of regions ', async (done) => {
    const res = await getRegionsList() ;
    expect(Array.isArray(res)).toBe(true);
    expect(res.includes('berlin')).toBe(true);

    // expect(typeof res).toBe(Region);
    // const res = await request(app).get('/api/v1/users/');
    // expect(res.status).toBe(200);
    // expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });

  test('should get a spot', async (done) => {
    const res = await getSpotByUserAndId(1,1) ;
    expect(res).toBeInstanceOf(Bathingspot);

    // expect(typeof res).toBe(Region);
    // const res = await request(app).get('/api/v1/users/');
    // expect(res.status).toBe(200);
    // expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('should get a spot', async (done) => {
    const res = await getBathingspotById(1) ;
    expect(res).toBeInstanceOf(Bathingspot);

    // expect(typeof res).toBe(Region);
    // const res = await request(app).get('/api/v1/users/');
    // expect(res.status).toBe(200);
    // expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });

  test('should get a user with relation', async (done) => {
    const res = await getUserWithRelations(1, ['regions']) as User;
    expect(res).toBeInstanceOf(User);
    expect(Array.isArray(res.regions)).toBe(true);
    expect(res.regions).toBeDefined();

    // expect(typeof res).toBe(Region);
    // const res = await request(app).get('/api/v1/users/');
    // expect(res.status).toBe(200);
    // expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
});
