/**
 * Use this layout for creating new integration tests
 * that use the API auth0 authentification
 */
jest.useFakeTimers();
import express from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection, getRepository } from 'typeorm';

import routesPublic from '../../../src/lib/routes-public';
import {
  closeTestingConnections,
  createTestingConnections,
  reloadTestingDatabases,
} from '../../test-utils';
import { Bathingspot } from '../../../src/orm/entity';

// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

// const token = readTokenFromDisc(
//   path.resolve(__dirname, '../../.test.token.json'),
// );

describe('misc functions that need a DB', () => {
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

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/v1/', routesPublic);

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

  test('route get spots should be accesable', async (done) => {
    const res = await request(app).get('/api/v1/bathingspots/');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });

  test('should get only public spots', async (done) => {
    const src = [
      { isPublic: true, name: 'special' },
      { isPublic: false, name: 'special' },
      { isPublic: false, name: 'special' },
      { isPublic: false, name: 'special' },
    ];
    const spotRepo = getRepository(Bathingspot);
    const spots = [];
    for (const item of src) {
      const spot = spotRepo.create(item);
      const res = await spotRepo.save(spot);
      spots.push(res);
    }
    const response = await request(app).get('/api/v1/bathingspots');
    expect(
      response.body.data.filter((item: any) => item.name === 'special').length,
    ).toBe(1);
    done();
  });
});
