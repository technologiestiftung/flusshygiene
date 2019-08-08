jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection, getRepository } from 'typeorm';
import { ERRORS, SUCCESS, SUGGESTIONS } from '../../../src/lib/messages';
import routes from '../../../src/lib/routes';
import { UserRole } from '../../../src/lib/common';
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

const token = readTokenFromDisc(
  path.resolve(__dirname, '../../.test.token.json'),
);
const headers = {
  authorization: `${token.token_type} ${token.access_token}`,
  Accept: 'application/json',
};

describe('testing users/[:userId]/bathingspots/[:spotId] delete', () => {
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

  test('should fail due wrong spot id', async (done) => {
    const userRepo = getRepository(User);

    const usersWithSpotsRelation = await userRepo.find({
      relations: ['bathingspots'],
    });
    const usersWithSpots = usersWithSpotsRelation.filter(
      (u) => u.bathingspots.length > 0,
    );
    const user = usersWithSpots[0];
    const res = await request(app)
      .delete(`/api/v1/users/${user.id}/bathingspots/${100000}`)
      .send({})
      .set(headers);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(ERRORS.badRequestMissingOrWrongID404);
    expect(res.body.data).toBe(undefined);
    done();
  });

  test('should fail due to missing force', async (done) => {
    const userRepo = getRepository(User);
    const usersWithSpotsRelation = await userRepo.find({
      relations: ['bathingspots'],
      where: { protected: false },
    });
    const usersWithSpots = usersWithSpotsRelation.filter(
      (u) => u.bathingspots.length > 0,
    );
    const user = usersWithSpots[0];
    const publicSpots = user.bathingspots.filter(
      (_spot) => _spot.isPublic === true,
    );
    const spot = publicSpots[0];
    const res = await request(app)
      .delete(`/api/v1/users/${user.id}/bathingspots/${spot.id}`)
      .send({})
      .set(headers);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(SUGGESTIONS.missingFields);
    expect(res.body.data.hasOwnProperty('force')).toBe(true);
    expect(res.body.data.force).toBe(true);
    done();
  });
  test('should delete public bathingspot by using force', async (done) => {
    const userRepo = getRepository(User);
    const usersAndSpots = await userRepo.find({
      relations: ['bathingspots'],
      where: { role: UserRole.creator },
    });
    const id = usersAndSpots[usersAndSpots.length - 1].id;
    // create one for deletion
    await request(app)
      .post(`/api/v1/users/${id}/bathingspots`)
      .send({
        isPublic: true,
        name: 'Sweetwater',
        region: 'berlin',
      })
      .set(headers);
    // console.log('creation', resCreation.body);
    const spots = await request(app)
      .get(`/api/v1/users/${id}/bathingspots`)
      .set(headers);
    const pubSpots = spots.body.data.filter((spot) => spot.isPublic === true);
    const res = await request(app)
      .delete(`/api/v1/users/${id}/bathingspots/${pubSpots[0].id}`)
      .send({ force: true })
      .set(headers);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual(SUCCESS.successDeleteSpot200);
    done();
  });
});
