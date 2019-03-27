import { RegionRepository } from '../src/lib/repositories/RegionRepository';
import { UserRepository } from '../src/lib/repositories/UserRepository';
import { HttpCodes } from '../src/lib/types-interfaces';
// tslint:disable: ordered-imports
jest.useFakeTimers();
import { SUCCESS } from '../src/lib/messages/success';
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { createConnection, getConnection, getRepository, getCustomRepository } from 'typeorm';
import { ERRORS } from '../src/lib/messages';
import {
  getBathingspotById,
  getSpotByUserAndId,
  getUserWithRelations,
  getRegionsList,
} from '../src/lib/repositories/custom-repo-helpers';
import routes from '../src/lib/routes';
import {
  DefaultRegions,
  UserRole,
} from '../src/lib/types-interfaces';
import { Bathingspot } from '../src/orm/entity/Bathingspot';
import { BathingspotModel } from '../src/orm/entity/BathingspotModel';
import { BathingspotPrediction } from '../src/orm/entity/BathingspotPrediction';
import { BathingspotRawModelData } from '../src/orm/entity/BathingspotRawModelData';
import { Questionaire } from '../src/orm/entity/Questionaire';
import { Region } from '../src/orm/entity/Region';
import { createProtectedUser } from '../src/orm/fixtures/create-protected-user';
import { SUGGESTIONS } from '../src/lib/messages/suggestions';
import { User } from '../src/orm/entity/User';

let app: Application;

// ███████╗███████╗████████╗██╗   ██╗██████╗
// ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
// ███████╗█████╗     ██║   ██║   ██║██████╔╝
// ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝
// ███████║███████╗   ██║   ╚██████╔╝██║
// ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝

beforeAll((done) => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('We are not in the test env this is harmful tables will be dropped');
  }
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/v1/', routes);

  const p = createConnection({
    database: 'postgres',
    dropSchema: true,
    entities: [
      User,
      Region,
      Questionaire,
      Bathingspot,
      BathingspotModel,
      BathingspotPrediction,
      BathingspotRawModelData,
    ],
    host: 'localhost',
    logging: false,
    password: 'postgres_password',
    port: 5432,
    synchronize: true,
    type: 'postgres',
    username: 'postgres',
  });

  p.then(con => {
    // const db = await con.connect();
    // process.stdout.write(db.name);
    con.manager.save(createProtectedUser()).then(() => {
      const user = new User();
      user.firstName = 'James';
      user.lastName = 'Bond';
      user.role = UserRole.creator;
      user.email = 'faker@fake.com';
      const spot = new Bathingspot();
      const regions: Region[] = [];
      for (const key in DefaultRegions) {
        if (DefaultRegions.hasOwnProperty(key)) {
          const r = new Region();
          r.name = key;
          r.displayName = key;
          regions.push(r);
        }
      }
      spot.region = regions[0];
      spot.isPublic = true;
      spot.name = 'billabong';

      user.bathingspots = [spot];
      con.manager.save(regions).then(() => {
        con.manager.save(spot).then(() => {
          con.manager.save(user).then(() => {
            // connection = con;
            done();

          }).catch(err => { throw err; });
        }).catch(err => { throw err; });
      }).catch(err => { throw err; });
    }).catch(err => { throw err; });
  }).catch(err => { throw err; });
});

afterAll((done) => {
  const con = getConnection();
  con.dropDatabase().then(() => {
    con.close().then(() => {

      done();
    }).catch(err => { throw err; });
  }).catch(err => { throw err; });
});

// ██████╗  ██████╗ ███╗   ██╗███████╗
// ██╔══██╗██╔═══██╗████╗  ██║██╔════╝
// ██║  ██║██║   ██║██╔██╗ ██║█████╗
// ██║  ██║██║   ██║██║╚██╗██║██╔══╝
// ██████╔╝╚██████╔╝██║ ╚████║███████╗
// ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝

describe('misc functions that need a DB', () => {
  test('should return a list of default regions', async (done) => {
    const list = await getRegionsList();
    for (const key in DefaultRegions) {
      if (DefaultRegions.hasOwnProperty(key)) {
        const element = DefaultRegions[key];
        expect(list.includes(element)).toBe(true);
      }
    }
    done();
  });
});
// ###############################################
// ###
// ###
// ###
// ###
// ###############################################

// ██╗   ██╗███████╗███████╗██████╗
// ██║   ██║██╔════╝██╔════╝██╔══██╗
// ██║   ██║███████╗█████╗  ██████╔╝
// ██║   ██║╚════██║██╔══╝  ██╔══██╗
// ╚██████╔╝███████║███████╗██║  ██║
//  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝

//  ██████╗ ███████╗████████╗
// ██╔════╝ ██╔════╝╚══██╔══╝
// ██║  ███╗█████╗     ██║
// ██║   ██║██╔══╝     ██║
// ╚██████╔╝███████╗   ██║
//  ╚═════╝ ╚══════╝   ╚═╝

describe('testing get users', () => {
  test.skip('route should fail due to wrong route', async (done) => {
    expect.assertions(2);
    const res = await request(app).get('/api/v1/');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    done();
  });

  test('route get users', async (done) => {
    // expect.assertions(2);
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    // expect(res.body[0]).toHaveProperty('email');
    // expect(res.body[0]).toHaveProperty('firstName');
    // expect(res.body[0]).toHaveProperty('lastName');
    // expect(res.body[0]).toHaveProperty('role');
    done();
  });

  test('route get user by id', async (done) => {
    expect.assertions(2);
    const res = await request(app).get('/api/v1/users/1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });

  test('route get user should fail due to worng id', async (done) => {
    expect.assertions(2);
    const res = await request(app).get(`/api/v1/users/${100000}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    done();
  });
});

// ██████╗  ██████╗ ███████╗████████╗
// ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
// ██████╔╝██║   ██║███████╗   ██║
// ██╔═══╝ ██║   ██║╚════██║   ██║
// ██║     ╚██████╔╝███████║   ██║
// ╚═╝      ╚═════╝ ╚══════╝   ╚═╝
// ██╗   ██╗███████╗███████╗██████╗
// ██║   ██║██╔════╝██╔════╝██╔══██╗
// ██║   ██║███████╗█████╗  ██████╔╝
// ██║   ██║╚════██║██╔══╝  ██╔══██╗
// ╚██████╔╝███████║███████╗██║  ██║
//  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝

describe('testing add users', () => {

  test('add user', async (done) => {
    // process.env.NODE_ENV = 'development';

    const res = await request(app).post('/api/v1/users').send({
      email: 'lilu@fifth-element.com',
      firstName: 'Lilu',
      lastName: 'Mulitpass',
      role: UserRole.reporter,
    })
      .set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    done();
  });

  test('add user creator (should have a region set)', async (done) => {
    // process.env.NODE_ENV = 'development';
    const res = await request(app).post('/api/v1/users').send({
      email: 'baz@bong.com',
      firstName: 'Me',
      lastName: 'You',
      region: DefaultRegions.berlin,
      role: UserRole.creator,
    })
      .set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('add user shoud fail due to missing values', async () => {
    expect.assertions(1);
    const res = await request(app).post('/api/v1/users').send({
    })
      .set('Accept', 'application/json');
    expect(res.status).toBe(404);
  });

  test('add user shoud fail due to missing firstName', async () => {
    expect.assertions(1);
    const res = await request(app).post('/api/v1/users').send({
      email: 'lilu@fifth-element.com',
      lastName: 'Mulitpass',
      role: 'reporter',
    })
      .set('Accept', 'application/json');
    expect(res.status).toBe(404);
  });

  test('add user shoud fail due to missing lastName', async () => {
    expect.assertions(1);
    const res = await request(app).post('/api/v1/users').send({
      email: 'lilu@fifth-element.com',
      firstName: 'Lilu',
      role: 'reporter',
    })
      .set('Accept', 'application/json');
    expect(res.status).toBe(404);
  });
  test('add user shoud fail due to missing email', async () => {
    expect.assertions(1);
    const res = await request(app).post('/api/v1/users').send({
      firstName: 'Lilu',
      lastName: 'Mulitpass',
      role: 'reporter',
    })
      .set('Accept', 'application/json');
    expect(res.status).toBe(404);
  });

  test('add user shoud fail due to missing role', async () => {
    expect.assertions(1);
    const res = await request(app).post('/api/v1/users').send({
      email: 'lilu@fifth-element.com',
      firstName: 'Lilu',
      lastName: 'Mulitpass',
    })
      .set('Accept', 'application/json');
    expect(res.status).toBe(404);
  });
});

// ██████╗ ██╗   ██╗████████╗
// ██╔══██╗██║   ██║╚══██╔══╝
// ██████╔╝██║   ██║   ██║
// ██╔═══╝ ██║   ██║   ██║
// ██║     ╚██████╔╝   ██║
// ╚═╝      ╚═════╝    ╚═╝

// ██╗   ██╗███████╗███████╗██████╗
// ██║   ██║██╔════╝██╔════╝██╔══██╗
// ██║   ██║███████╗█████╗  ██████╔╝
// ██║   ██║╚════██║██╔══╝  ██╔══██╗
// ╚██████╔╝███████║███████╗██║  ██║
//  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝

describe('testing update users', () => {

  test('update user', async (done) => {
    // process.env.NODE_ENV = 'development';
    // expect.assertions(2);
    const usersres = await request(app).get('/api/v1/users');
    const id = usersres.body.data[usersres.body.data.length - 1].id;
    const res = await request(app).put(`/api/v1/users/${id}`).send({
      email: 'foo@test.com',
    })
      .set('Accept', 'application/json');
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
      .set('Accept', 'application/json');
    console.log(newUserRes.body);
    // const usersres = await request(app).get('/api/v1/users');
    // const id = usersres.body.data[usersres.body.data.length - 1].id;
    const spotRes = await request(app).post(`/api/v1/users/${newUserRes.body.data[0].id}/bathingspots`).send({
      isPublic: false,
      name: 'intermidiante spot',
    }).set('Accept', 'application/json');

    const res = await request(app).put(
      `/api/v1/users/${newUserRes.body.data[0].id}`).send({
              email: 'foo@test.com',
              region: DefaultRegions.niedersachsen,
            })
              .set('Accept', 'application/json');

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
      `/api/v1/users/${1000}`);
    expect(res.status).toBe(404);
    // console.log(res.body);
    expect(res.body.success).toBe(false);
    // expect(res.body.data.length).toBe(0);
    done();
  });
  test('user fail due to wrong route', async (done) => {
    const userRepo = getCustomRepository(UserRepository);
    const usersWithRelations = await userRepo.find({relations: ['bathingspots']});

    // console.log(usersWithRelations);
    const res = await request(app).put(
      `/api/v1/users/`);
    expect(res.status).toBe(404);
    // console.log(res.body);
    // expect(res.body.success).toBe(false);
    // expect(res.body.data.length).toBe(0);
    done();
  });
});

// ██╗   ██╗███████╗███████╗██████╗
// ██║   ██║██╔════╝██╔════╝██╔══██╗
// ██║   ██║███████╗█████╗  ██████╔╝
// ██║   ██║╚════██║██╔══╝  ██╔══██╗
// ╚██████╔╝███████║███████╗██║  ██║
//  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝

// ███████╗██████╗  ██████╗ ████████╗███████╗
// ██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝
// ███████╗██████╔╝██║   ██║   ██║   ███████╗
// ╚════██║██╔═══╝ ██║   ██║   ██║   ╚════██║
// ███████║██║     ╚██████╔╝   ██║   ███████║
// ╚══════╝╚═╝      ╚═════╝    ╚═╝   ╚══════╝

//  ██████╗ ███████╗████████╗
// ██╔════╝ ██╔════╝╚══██╔══╝
// ██║  ███╗█████╗     ██║
// ██║   ██║██╔══╝     ██║
// ╚██████╔╝███████╗   ██║
//  ╚═════╝ ╚══════╝   ╚═╝

describe('testing bathingspots get for a specific user', () => {

  test('should return at least an empty array of bathingspots', async (done) => {
    const res = await request(app).get('/api/v1/users/2/bathingspots');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('user should have a bathingspot', async (done) => {
    const res = await request(app).get('/api/v1/users/2/bathingspots');
    expect(res.status).toBe(200);
    expect(res.body.data.length >= 1).toBe(true);
    done();
  });
  test('user should have no bathingspot in region', async (done) => {
    const res = await request(app).get(`/api/v1/users/2/bathingspots/${DefaultRegions.schleswigholstein}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
    done();
  });
  test.skip('user should have a bathingspot with id', async (done) => {
    const userRepo = getCustomRepository(UserRepository);
    const usersWithRelations = await userRepo.find({relations: ['bathingspots']});

    // console.log(usersWithRelations);
    const res = await request(app).get(
      `/api/v1/users/${usersWithRelations[0].id}/bathingspots/${usersWithRelations[0].bathingspots[0].id}`);
    expect(res.status).toBe(200);
    // console.log(res.body);
    expect(res.body.data.length > 0).toBe(true);
    done();
  });
  test('region should not exist', async (done) => {
    const userRepo = getCustomRepository(UserRepository);
    const usersWithRelations = await userRepo.find({relations: ['bathingspots']});

    // console.log(usersWithRelations);
    const res = await request(app).get(
      `/api/v1/users/${usersWithRelations[0].id}/bathingspots/foo`);
    expect(res.status).toBe(404);
    // console.log(res.body);
    expect(res.body.success).toBe(false);
    done();
  });
  test('user should have no bathingspot in region', async (done) => {
    const userRepo = getCustomRepository(UserRepository);
    const usersWithRelations = await userRepo.find({relations: ['bathingspots']});

    // console.log(usersWithRelations);
    const res = await request(app).get(
      `/api/v1/users/${usersWithRelations[0].id}/bathingspots/${DefaultRegions.schleswigholstein}`);
    expect(res.status).toBe(200);
    // console.log(res.body);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(0);
    done();
  });
  test('should fail due to wrong user id', async (done) => {
    const res = await request(app).get(`/api/v1/users/${10000}/bathingspots`);
    expect(res.status).toBe(404);
    expect(res.body.data).toBeUndefined();
    expect(res.body.success).toBe(false);
    done();
  });
  test('should fail due to wrong bathingspot id', async (done) => {
    const res = await request(app).get(`/api/v1/users/${2}/bathingspots/${10000}`);
    expect(res.status).toBe(404);
    expect(res.body.data).toBeUndefined();
    expect(res.body.success).toBe(false);
    done();
  });
});

// ██████╗  ██████╗ ███████╗████████╗
// ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
// ██████╔╝██║   ██║███████╗   ██║
// ██╔═══╝ ██║   ██║╚════██║   ██║
// ██║     ╚██████╔╝███████║   ██║
// ╚═╝      ╚═════╝ ╚══════╝   ╚═╝
// ███████╗██████╗  ██████╗ ████████╗
// ██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝
// ███████╗██████╔╝██║   ██║   ██║
// ╚════██║██╔═══╝ ██║   ██║   ██║
// ███████║██║     ╚██████╔╝   ██║
// ╚══════╝╚═╝      ╚═════╝    ╚═╝

describe('testing bathingspots post for a specific user', () => {

  test('should fail due to missing isPublic values', async (done) => {
    const userRepo = getRepository(User);
    const users: User[] = await userRepo.find({ relations: ['bathingspots'], where: {role: UserRole.creator}});
    // console.log(users);
    const user: User = users[0]; // last created user
    const id = user.id;

    const res = await request(app).post(`/api/v1/users/${id}/bathingspots`).send({
      apiEndpoints: {},
      elevation: 1,
      /*isPublic: true,*/
      latitude: 13,
      location: {},
      longitude: 52,
      name: 'Sweetwater',
      state: {},
    }).set('Accept', 'application/json');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(SUGGESTIONS.missingFields);
    done();
  });

  test('should fail due to wrong user id', async (done) => {

    const res = await request(app).post(`/api/v1/users/${100000}/bathingspots`).send({
      apiEndpoints: {},
      elevation: 1,
      isPublic: true,
      latitude: 13,
      location: {},
      longitude: 52,
      name: 'Sweetwater',
      state: {},
    }).set('Accept', 'application/json');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(ERRORS.badRequestMissingOrWrongID404);
    done();
  });

  test('should fail due to wrong user role', async (done) => {
    const userRepo = getCustomRepository(UserRepository);
    const usersWithRole = await userRepo.findAllByRole(UserRole.reporter);
    const res = await request(app).post(`/api/v1/users/${usersWithRole[0].id}/bathingspots`).send({
      apiEndpoints: {},
      elevation: 1,
      isPublic: true,
      latitude: 13,
      location: {},
      longitude: 52,
      name: 'Sweetwater',
      state: {},
    }).set('Accept', 'application/json');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(ERRORS.badRequestUserNotAuthorized);
    done();
  });

  test('should add bathingspot to user', async (done) => {
    const userRepo = getRepository(User);
    const users: User[] = await userRepo.find({ where: {role: UserRole.creator}, relations: ['bathingspots'] });
    const user: User = users[users.length - 1]; // last created user
    const id = user.id;
    const spots = user.bathingspots;
    const res = await request(app).post(`/api/v1/users/${id}/bathingspots`).send({
      apiEndpoints: {},
      elevation: 1,
      isPublic: true,
      latitude: 13,
      location: {},
      longitude: 52,
      name: 'Sweetwater',
      region: DefaultRegions.berlin,
      state: {},
    }).set('Accept', 'application/json');
    const againUser: User | undefined = await userRepo.findOne(id, { relations: ['bathingspots'] });
    if (againUser !== undefined) {
      const againSpots: Bathingspot[] | undefined = againUser.bathingspots;
      if (againSpots !== undefined) {
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(againSpots.length).toBe(spots.length + 1);
      } else {
        throw new Error();
      }
    } else {
      throw new Error();
    }
    done();
  });

});

// ██████╗ ██╗   ██╗████████╗
// ██╔══██╗██║   ██║╚══██╔══╝
// ██████╔╝██║   ██║   ██║
// ██╔═══╝ ██║   ██║   ██║
// ██║     ╚██████╔╝   ██║
// ╚═╝      ╚═════╝    ╚═╝

describe('testing bathingspots update (put) for a specific user', () => {

  test('should fail due to wrong id of a bathingspot', async (done) => {
    const userRepo = getRepository(User);
    const usersAndSpots = await userRepo.find({ relations: ['bathingspots'] });
    const usersWithSpots = usersAndSpots.filter(u => u.bathingspots.length > 0);
    const user = usersWithSpots[0];

    const res = await request(app).put(`/api/v1/users/${user.id}/bathingspots/${10000}`).send({
      name: 'watering hole',
    }).set('Accept', 'application/json');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(ERRORS.badRequestMissingOrWrongID404);
    done();
  });

  test('should change the name of a bathingspot', async (done) => {
    const userRepo = getRepository(User);
    const spotRepo = getRepository(Bathingspot);
    const usersAndSpots = await userRepo.find({ relations: ['bathingspots'] });
    const usersWithSpots = usersAndSpots.filter(u => u.bathingspots.length > 0);
    const user = usersWithSpots[0];
    const spot = user.bathingspots[0];
    const res = await request(app).put(`/api/v1/users/${user.id}/bathingspots/${spot.id}`).send({
      name: 'watering hole',
    }).set('Accept', 'application/json');
    const spotAgain: Bathingspot | undefined = await spotRepo.findOne(spot.id);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].name).toEqual('watering hole');
    expect(spotAgain.name).toEqual('watering hole');
    done();
  });

  test('should set all the fields of a bathingspot', async (done) => {
    const userRepo = getRepository(User);
    const spotRepo = getRepository(Bathingspot);
    const usersAndSpots = await userRepo.find({ relations: ['bathingspots'] });
    const usersWithSpots = usersAndSpots.filter(u => u.bathingspots.length > 0);
    const user = usersWithSpots[0];
    const spot = user.bathingspots[0];
    const res = await request(app).put(`/api/v1/users/${user.id}/bathingspots/${spot.id}`).send({
      apiEndpoints: {},
      elevation: 1,
      isPublic: true,
      latitude: 13,
      location: {},
      longitude: 52,
      name: 'Sweetwater',
      state: {},
    }).set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].name).toEqual('Sweetwater');
    done();
  });

  test('should reject the change due to wrong fields but present an example', async (done) => {
    const userRepo = getRepository(User);
    // const spotRepo = getRepository(Bathingspot);
    const usersAndSpots = await userRepo.find({ relations: ['bathingspots'] });
    // const usersAndSpots = await userRepo.createQueryBuilder('user')
    // .leftJoinAndSelect('user.bathingspots', 'bathingspots')
    //   .getMany();
    const usersWithSpots = usersAndSpots.filter(_user => _user.bathingspots.length > 0);

    const user = usersWithSpots[0];
    const spot = user.bathingspots[0];
    const res = await request(app).put(`/api/v1/users/${user.id}/bathingspots/${spot.id}`).send({
    }).set('Accept', 'application/json');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(SUGGESTIONS.missingFields);
    done();
  });
});

// ██████╗ ███████╗██╗     ███████╗████████╗███████╗
// ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝
// ██║  ██║█████╗  ██║     █████╗     ██║   █████╗
// ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝
// ██████╔╝███████╗███████╗███████╗   ██║   ███████╗
// ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝

// ███████╗██████╗  ██████╗ ████████╗
// ██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝
// ███████╗██████╔╝██║   ██║   ██║
// ╚════██║██╔═══╝ ██║   ██║   ██║
// ███████║██║     ╚██████╔╝   ██║
// ╚══════╝╚═╝      ╚═════╝    ╚═╝

describe('testing spot deletion', () => {
  test('should fail due wrong spot id', async (done) => {
    const userRepo = getRepository(User);

    const usersWithSpots = await userRepo.find({ relations: ['bathingspots'] });
    const user = usersWithSpots[0];
    // const publicSpots = user.bathingspots.filter(spot => spot.isPublic === true);
    // const spot = publicSpots[0];
    const res = await request(app).delete(
      `/api/v1/users/${user.id}/bathingspots/${100000}`).send({}).set('Accept', 'application/json');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(ERRORS.badRequestMissingOrWrongID404);
    expect(res.body.data).toBe(undefined);
    done();

  });

  test('should fail due to missing force', async (done) => {
    const userRepo = getRepository(User);
    const usersWithSpots = await userRepo.find({ relations: ['bathingspots'] });
    const user = usersWithSpots[0];
    const publicSpots = user.bathingspots.filter(_spot => _spot.isPublic === true);
    const spot = publicSpots[0];
    const res = await request(app).delete(
      `/api/v1/users/${user.id}/bathingspots/${spot.id}`,
    ).send({}).set('Accept', 'application/json');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(SUGGESTIONS.missingFields);
    expect(res.body.data.hasOwnProperty('force')).toBe(true);
    expect(res.body.data.force).toBe(true);
    done();

  });
  test('should delete public bathingspot by using force', async (done) => {
    const userRepo = getRepository(User);
    const usersAndSpots = await userRepo.find({ relations: ['bathingspots'], where: {role: UserRole.creator} });
    const id = usersAndSpots[usersAndSpots.length - 1].id;
    // create one for deletion
    await request(app).post(`/api/v1/users/${id}/bathingspots`).send({
      isPublic: true,
      name: 'Sweetwater',
      region: 'berlin',
    }).set('Accept', 'application/json');
    // console.log('creation', resCreation.body);
    const spots = await request(app).get(`/api/v1/users/${id}/bathingspots`);
    const pubSpots = spots.body.data.filter(spot => spot.isPublic === true);
    const res = await request(app).delete(
      `/api/v1/users/${id}/bathingspots/${pubSpots[0].id}`,
    ).send({ force: true });
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual(SUCCESS.successDeleteSpot200);
    done();
  });
});

// ███████╗██████╗  ██████╗ ████████╗███████╗
// ██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝
// ███████╗██████╔╝██║   ██║   ██║   ███████╗
// ╚════██║██╔═══╝ ██║   ██║   ██║   ╚════██║
// ███████║██║     ╚██████╔╝   ██║   ███████║
// ╚══════╝╚═╝      ╚═════╝    ╚═╝   ╚══════╝
//  ██████╗ ███████╗████████╗
// ██╔════╝ ██╔════╝╚══██╔══╝
// ██║  ███╗█████╗     ██║
// ██║   ██║██╔══╝     ██║
// ╚██████╔╝███████╗   ██║
//  ╚═════╝ ╚══════╝   ╚═╝

describe('testing get bathingspots', () => {

  test.skip('route should fail due to wrong route', async (done) => {
    expect.assertions(2);
    const res = await request(app).get('/api/v1/');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    done();
  });

  test('route get bathingspots', async (done) => {
    expect.assertions(2);
    const res = await request(app).get('/api/v1/bathingspots');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    done();
  });

  test('route get bathingspot by id', async (done) => {
    // expect.assertions(2);
    const res = await request(app).get('/api/v1/bathingspots/1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    done();
  });

  test('route get single bathingspot should fail due to worng id', async (done) => {
    // expect.assertions(2);
    const res = await request(app).get(`/api/v1/bathingspots/${100000}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    done();
  });
  test('should fail due to wrong spot region id', async (done) => {
    const res = await request(app).get(`/api/v1/bathingspots/foo`);
    expect(res.status).toBe(HttpCodes.badRequestNotFound);
    expect(res.body.success).toBe(false);
    done();
  });
  test('should return empty spot array', async (done) => {
    const res = await request(app).get(`/api/v1/bathingspots/${DefaultRegions.schleswigholstein}`);
    expect(res.status).toBe(HttpCodes.success);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(0);
    done();
  });
});

// ██████╗ ███████╗██╗     ███████╗████████╗███████╗
// ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝
// ██║  ██║█████╗  ██║     █████╗     ██║   █████╗
// ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝
// ██████╔╝███████╗███████╗███████╗   ██║   ███████╗
// ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝
// ██╗   ██╗███████╗███████╗██████╗
// ██║   ██║██╔════╝██╔════╝██╔══██╗
// ██║   ██║███████╗█████╗  ██████╔╝
// ██║   ██║╚════██║██╔══╝  ██╔══██╗
// ╚██████╔╝███████║███████╗██║  ██║
//  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝

describe('testing delete users', () => {
  test('delete users', async (done) => {
    // process.env.NODE_ENV = 'development';
    const usersres = await request(app).get('/api/v1/users');
    expect.assertions(2);
    // for(let i = usersres.body.length -1; i >=0;i--){
    const id = usersres.body.data[usersres.body.data.length - 1].id;

    const res = await request(app).delete(`/api/v1/users/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    done();
  });
  test('delete user should fail due to missing id', async (done) => {
    expect.assertions(1);
    const res = await request(app).delete(`/api/v1/users`);

    expect(res.status).toBe(404);
    done();
  });
  test('delete user should fail due to wrong id', async (done) => {
    expect.assertions(1);
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

    // console.log(usersWithRelations);
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

describe('testing errors on repo helpers', () => {
  it('should be catch error due to missing db', (done) => {
    getUserWithRelations(10000, []).then(res => {
      expect(res).toBe(undefined);
      done();
    }).catch(err => {
      expect(err.message).toEqual('Connection "default" was not found.');
      done();
    });
  });

  it('should be catch error due to missing db', (done) => {
    getBathingspotById(10000).then(res => {
      expect(res).toBe(undefined);
      done();
    }).catch(err => {
      expect(err.message).toEqual('Connection "default" was not found.');
      done();
    });
  });

  it('should be catch error due to missing db', (done) => {
    getSpotByUserAndId(10000, 10000).then(res => {
      expect(res).toBe(undefined);
      done();
    }).catch(err => {
      expect(err.message).toEqual('Connection "default" was not found.');
      done();
    });
  });
});

// ██████╗ ███████╗ ██████╗ ██╗ ██████╗ ███╗   ██╗
// ██╔══██╗██╔════╝██╔════╝ ██║██╔═══██╗████╗  ██║
// ██████╔╝█████╗  ██║  ███╗██║██║   ██║██╔██╗ ██║
// ██╔══██╗██╔══╝  ██║   ██║██║██║   ██║██║╚██╗██║
// ██║  ██║███████╗╚██████╔╝██║╚██████╔╝██║ ╚████║
// ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝ ╚═════╝ ╚═╝  ╚═══╝

describe('testing region routes', () => {
  test('should get all regions', async (done) => {
    const res = await request(app).get(`/api/v1/regions`);
    expect(res.status).toBe(HttpCodes.success);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].id !== undefined).toBe(true);
    expect(res.body.data[0].name !== undefined).toBe(true);
    expect(res.body.data[0].displayName !== undefined).toBe(true);
    done();
  });
  test('should post a new region', async (done) => {
    const res = await request(app).post(`/api/v1/regions`).send({
      displayName: 'Bayern',
      name: 'bayern',
    });
    expect(res.status).toBe(HttpCodes.successCreated);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].id !== undefined).toBe(true);
    expect(res.body.data[0].name !== undefined).toBe(true);
    expect(res.body.data[0].displayName !== undefined).toBe(true);
    done();
  });
  test('should update a region', async (done) => {
    const regionRepo = getCustomRepository(RegionRepository);
    const region = await regionRepo.findByName(DefaultRegions.niedersachsen);
    const res = await request(app).put(
      `/api/v1/regions/${region.id}`,
      ).send({
        displayName: 'Niedersachsen',
      }).set('Accept', 'application/json');
    const doubeCheckRegion = await request(app).get(`/api/v1/regions/${region.id}`);
    expect(res.status).toBe(HttpCodes.successCreated);
    // console.log(res.body);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].displayName).toEqual('Niedersachsen');
    // console.log(doubeCheckRegion.body);
    expect(doubeCheckRegion.body.data[0].displayName).toEqual('Niedersachsen');
    done();
});
  test('should fail to update due to wrong id', async (done) => {
    const res = await request(app).put(
      `/api/v1/regions/${1000}`,
      ).send({
        displayName: 'Niedersachsen',
      }).set('Accept', 'application/json');
    expect(res.status).toBe(HttpCodes.badRequestNotFound);
      // console.log(res.body);
    expect(res.body.success).toBe(false);
      // console.log(doubeCheckRegion.body);
    done();
  });
  test('should fail to delete due to wrong id', async (done) => {
    const res = await request(app).put(
      `/api/v1/regions/${1000}`,
      );
    expect(res.status).toBe(HttpCodes.badRequestNotFound);
      // console.log(res.body);
    expect(res.body.success).toBe(false);
      // console.log(doubeCheckRegion.body);
    done();
  });
  test('should delete a region', async (done) => {
    const resCreate = await request(app).post(`/api/v1/regions`).send({
      displayName: 'Fantasia',
      name: 'fantasia',
    });

    const res = await request(app).delete(`/api/v1/regions/${resCreate.body.data[0].id}`);
    // console.log(res.body);
    expect(res.status).toBe(HttpCodes.success);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    // expect(res.body.data[0].id !== undefined).toBe(true);
    // expect(res.body.data[0].name !== undefined).toBe(true);
    // expect(res.body.data[0].displayName !== undefined).toBe(true);
    done();
  });
});
