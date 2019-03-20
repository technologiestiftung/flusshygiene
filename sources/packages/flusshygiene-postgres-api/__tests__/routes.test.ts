import { SUCCESS } from './../src/lib/messages/success';
jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { createConnection, getConnection, getRepository } from 'typeorm';
import { ERRORS } from '../src/lib/messages';
import {
  getBathingspotById,
  getSpotByUserAndId,
  getUserWithRelations,
} from '../src/lib/repositories/custom-repo-helpers';
import routes from '../src/lib/routes';
import {
  Regions,
  UserRole,
} from '../src/lib/types-interfaces';
import { Bathingspot } from '../src/orm/entity/Bathingspot';
import { BathingspotModel } from '../src/orm/entity/BathingspotModel';
import { BathingspotPrediction } from '../src/orm/entity/BathingspotPrediction';
import { BathingspotRawModelData } from '../src/orm/entity/BathingspotRawModelData';
import { Questionaire } from '../src/orm/entity/Questionaire';
import { Region } from '../src/orm/entity/Region';
import { createProtectedUser } from '../src/orm/fixtures/create-protected-user';
import { SUGGESTIONS } from './../src/lib/messages/suggestions';
import { User } from './../src/orm/entity/User';
// let connection: Connection;
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
      const region = new Region();
      region.name = Regions.berlinbrandenburg;
      spot.region = region;
      spot.isPublic = true;
      spot.name = 'billabong';
      user.bathingspots = [spot];
      con.manager.save(region).then(() => {
        con.manager.save(spot).then(() => {
          con.manager.save(user).then(() => {
            // connection = con;
            done();
            console.log('done with beforeAll setup');
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
      console.log('Done with cleanup after all');
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

//  █████╗ ██████╗ ██████╗
// ██╔══██╗██╔══██╗██╔══██╗
// ███████║██║  ██║██║  ██║
// ██╔══██║██║  ██║██║  ██║
// ██║  ██║██████╔╝██████╔╝
// ╚═╝  ╚═╝╚═════╝ ╚═════╝

describe('testing add users', () => {
  test('add user', async () => {
    // process.env.NODE_ENV = 'development';
    expect.assertions(2);
    const res = await request(app).post('/api/v1/users').send({
      email: 'lilu@fifth-element.com',
      firstName: 'Lilu',
      lastName: 'Mulitpass',
      role: 'reporter',
    })
      .set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
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

// ██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗
// ██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
// ██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗
// ██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝
// ╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗
//  ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝

describe('testing update users', () => {

  test('update user', async (done) => {
    // process.env.NODE_ENV = 'development';
    expect.assertions(2);
    const usersres = await request(app).get('/api/v1/users');
    const id = usersres.body.data[usersres.body.data.length - 1].id;
    const res = await request(app).put(`/api/v1/users/${id}`).send({
      email: 'foo@test.com',
    })
      .set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
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

describe('testing bathingspots post for a specific user', () => {

  test('should add bathingspot to user', async (done) => {
    const userRepo = getRepository(User);
    const users: User[] = await userRepo.find({ relations: ['bathingspots'] });
    const user: User = users[users.length - 1]; // last created user
    const id = user.id;
    const spots = user.bathingspots;
    const res = await request(app).post(`/api/v1/users/${id}/bathingspots`).send({
      isPublic: true,
      name: 'Sweetwater',
    }).set('Accept', 'application/json');
    const againUser: User | undefined = await userRepo.findOne(id, { relations: ['bathingspots'] });

    const againSpots: Bathingspot[] | undefined = againUser.bathingspots;

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(againSpots.length).toBe(spots.length + 1);
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

  test('should change the name of a bathingspot', async (done) => {
    const userRepo = getRepository(User);
    const spotRepo = getRepository(Bathingspot);
    const usersAndSpots = await userRepo.find({ relations: ['bathingspots'] });
    // const usersAndSpots = await userRepo.createQueryBuilder('user')
    // .leftJoinAndSelect('user.bathingspots', 'bathingspots')
    //   .getMany();
    const usersWithSpots = usersAndSpots.filter(_user => _user.bathingspots.length > 0);

    // console.log(usersWithSpots);
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

  test('should reject the change due to wrong fields but present an example', async (done) => {
    const userRepo = getRepository(User);
    // const spotRepo = getRepository(Bathingspot);
    const usersAndSpots = await userRepo.find({ relations: ['bathingspots'] });
    // const usersAndSpots = await userRepo.createQueryBuilder('user')
    // .leftJoinAndSelect('user.bathingspots', 'bathingspots')
    //   .getMany();
    const usersWithSpots = usersAndSpots.filter(_user => _user.bathingspots.length > 0);

    // console.log(usersWithSpots);
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
    const res = await request(app).delete(`/api/v1/users/${user.id}/bathingspots/${100000}`).send({}).set('Accept', 'application/json');
    // console.log(res.body);
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
    const spotRepo = getRepository(Bathingspot);

    const usersAndSpots = await userRepo.find({ relations: ['bathingspots'] });
    const id = usersAndSpots[usersAndSpots.length - 1].id;
    // create one for deletion
    const resCreation = await request(app).post(`/api/v1/users/${id}/bathingspots`).send({
      isPublic: true,
      name: 'Sweetwater',
    }).set('Accept', 'application/json');

    const spotsBefore = await spotRepo.find();
    const spotNumBefore = spotsBefore.length;

    const res = await request(app).delete(
      `/api/v1/users/${id}/bathingspots/${resCreation.body.data[0].id}`,
      ).send({ force: true });
    const spotsAfter = await spotRepo.find();
    const spotNumAfter = spotsAfter.length;
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual(SUCCESS.successDeleteSpot200);
    expect(spotNumAfter).toBe(spotNumBefore - 1);
    done();
  });
});

// ███████╗██████╗  ██████╗ ████████╗███████╗
// ██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝
// ███████╗██████╔╝██║   ██║   ██║   ███████╗
// ╚════██║██╔═══╝ ██║   ██║   ██║   ╚════██║
// ███████║██║     ╚██████╔╝   ██║   ███████║
// ╚══════╝╚═╝      ╚═════╝    ╚═╝   ╚══════╝

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
});

// ██████╗ ███████╗██╗     ███████╗████████╗███████╗
// ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝
// ██║  ██║█████╗  ██║     █████╗     ██║   █████╗
// ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝
// ██████╔╝███████╗███████╗███████╗   ██║   ███████╗
// ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝

describe('testing delete users', () => {
  test('delete users', async (done) => {
    // process.env.NODE_ENV = 'development';
    const usersres = await request(app).get('/api/v1/users');
    expect.assertions(2);
    // for(let i = usersres.body.length -1; i >=0;i--){
    const id = usersres.body.data[usersres.body.data.length - 1].id;
    // console.log(id);
    const res = await request(app).delete(`/api/v1/users/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // console.log(res.body);
    // }
    done();
  });
  test('delete user should fail due to missing id', async (done) => {
    expect.assertions(1);
    const res = await request(app).delete(`/api/v1/users`);
    // console.log(res);
    expect(res.status).toBe(404);
    done();
  });
  test('delete user should fail due to wrong id', async () => {
    expect.assertions(1);
    const res = await request(app).delete(`/api/v1/users/${10000000}`);
    expect(res.status).toBe(404);
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

