import { ModelParamter } from '../../../src/lib/common/index';
jest.useFakeTimers();
import FormData from 'form-data';
import { HttpCodes } from '../../../src/lib/common';
import express, { Application } from 'express';
import fs from 'fs';
import path from 'path';
import 'reflect-metadata';
import request from 'supertest';
import { Connection, getRepository } from 'typeorm';
import { DefaultRegions, UserRole } from '../../../src/lib/common';
import { ERRORS, SUGGESTIONS } from '../../../src/lib/messages';
import routes from '../../../src/lib/routes';
import { getUsersByRole } from '../../../src/lib/utils/user-repo-helpers';
import { Bathingspot } from '../../../src/orm/entity/Bathingspot';
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

describe('testing bathingspots post for a specific user', () => {
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
      // await reloadTestingDatabases(connections);
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

  test('should fail due to missing isPublic values', async (done) => {
    const userRepo = getRepository(User);
    const users: User[] = await userRepo.find({
      relations: ['bathingspots'],
      where: { role: UserRole.creator },
    });
    // console.log(users);
    const user: User = users[0]; // last created user
    const id = user.id;

    const res = await request(app)
      .post(`/api/v1/users/${id}/bathingspots`)
      .send({
        apiEndpoints: {},
        elevation: 1,
        /*isPublic: true,*/
        latitude: 13,
        longitude: 52,
        name: 'Sweetwater',
        state: {},
      })
      .set(headers);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/ispublic/i);
    done();
  });

  test('should fail due to wrong isPublic type', async () => {
    const userRepo = getRepository(User);
    const user: User = await userRepo.findOne({
      where: { role: UserRole.creator },
    });
    const id = user.id;
    const res = await request(app)
      .post(`/api/v1/users/${id}/bathingspots`)
      .send({
        isPublic: 'foo',
        name: 'will fail',
      })
      .set(headers);
    expect(res.status).toBe(HttpCodes.badRequest);
    expect(res.body.success).toBe(false);
  });
  test('should fail due to wrong user id', async (done) => {
    const res = await request(app)
      .post(`/api/v1/users/${100000}/bathingspots`)
      .send({
        apiEndpoints: {},
        elevation: 1,
        isPublic: true,
        latitude: 13,
        location: {},
        longitude: 52,
        name: 'Sweetwater',
        state: {},
      })
      .set(headers);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(ERRORS.badRequestMissingOrWrongID404);
    done();
  });

  test('Should add apiEndpoints to spot', async (done) => {
    const u = new User();

    u.firstName = 'foo';
    u.lastName = 'bah';
    u.email = 'foo@bah.com';

    u.role = UserRole.creator;
    const userRepo = getRepository(User);
    const user = await userRepo.save(u);
    const apiEndpoints = { measurementsUrl: 'http://example.com' };
    const spotRes = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots`)
      .send({ isPublic: true, name: 'Goohooo Boo' })
      .set(headers);
    // console.log(spotRes.body); // eslint-disable-line
    const spotResAgain = await request(app)
      .put(`/api/v1/users/${user.id}/bathingspots/${spotRes.body.data[0].id}`)
      .send({ apiEndpoints: apiEndpoints })
      .set(headers);

    // console.log(spotResAgain.body); // eslint-disable-line

    const res = await request(app)
      .get(
        `/api/v1/users/${user.id}/bathingspots/${spotResAgain.body.data[0].id}`,
      )
      .set(headers);

    expect(res.body.data[0].apiEndpoints).toStrictEqual(apiEndpoints);

    done();
  });

  test('should fail due to wrong user role', async (done) => {
    const reporter = new User();
    reporter.firstName = 'Karla';
    reporter.lastName = 'Kolumna';
    reporter.email = 'kk@foo.org';
    reporter.role = UserRole.reporter;
    const repo = getRepository(User);
    await repo.save(reporter);
    const usersWithRole = await getUsersByRole(UserRole.reporter);
    const res = await request(app)
      .post(`/api/v1/users/${usersWithRole[0].id}/bathingspots`)
      .send({
        apiEndpoints: {},
        elevation: 1,
        isPublic: true,
        latitude: 13,
        location: {},
        longitude: 52,
        name: 'Sweetwater',
        state: {},
      })
      .set(headers);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual(ERRORS.badRequestUserNotAuthorized);
    done();
  });

  test('should add bathingspot to user', async (done) => {
    const userRepo = getRepository(User);
    const users: User[] = await userRepo.find({
      relations: ['bathingspots'],
      where: { role: UserRole.creator },
    });
    const user: User = users[users.length - 1]; // last created user
    const id = user.id;
    const spots = user.bathingspots;

    const res = await request(app)
      .post(`/api/v1/users/${id}/bathingspots`)
      .send({
        apiEndpoints: {},
        elevation: 1,
        isPublic: true,
        latitude: 13,
        // location: {}, // <-- will produce an error
        longitude: 52,
        name: 'Sweetwater',
        region: DefaultRegions.berlin,
        state: {},
      })
      .set(headers);
    const againUser: User | undefined = await userRepo.findOne(id, {
      relations: ['bathingspots'],
    });
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

  test('should post image reference to spot', async (done) => {
    const res = await request(app)
      .post(`/api/v1/users/${1}/bathingspots/1/images`)
      .send({ url: 'http://placekitten.com/1080/540' })
      .set(headers);
    expect(res.status).toBe(201);
    done();
  });

  test('should post rmodel file to model', async (done) => {
    const spotRes = await request(app)
      .post('/api/v1/users/1/bathingspots')
      .send({ name: 'foo', isPublic: true })
      .set(headers);

    const modelRes = await request(app)
      .post(`/api/v1/users/1/bathingspots/${spotRes.body.data[0].id}/models`)
      .send({
        comment: 'Posting the model as text is deprecated',
        parameter: ModelParamter.conc_ec,
      })
      .set(headers);

    const form = new FormData();
    form.append('name', 'Multer');
    form.append('upload', path.resolve(__dirname, '../../data/test.png'));
    const formHeader = { ...headers };
    // formHeader.Accept = 'multipart/form-data';
    formHeader['Content-Type'] = 'multipart/form-data';
    const res = await request(app)
      .post(
        `/api/v1/users/${1}/bathingspots/${spotRes.body.data[0].id}/models/${
          modelRes.body.data[0].id
        }/upload/rmodel`,
      )
      .field(
        'upload',
        fs.createReadStream(
          path.resolve(__dirname, '../../data/large-file.bin'),
        ),
      )
      .set(formHeader);
    expect(res.status).toBe(201);
    done();
  });

  test('should post plot file to model', async (done) => {
    const spotRes = await request(app)
      .post('/api/v1/users/1/bathingspots')
      .send({ name: 'foo', isPublic: true })
      .set(headers);

    const modelRes = await request(app)
      .post(`/api/v1/users/1/bathingspots/${spotRes.body.data[0].id}/models`)
      .send({
        comment: 'Posting the model as text is deprecated',
        parameter: ModelParamter.conc_ec,
      })
      .set(headers);

    const form = new FormData();
    form.append('name', 'Multer');
    form.append('upload', path.resolve(__dirname, '../../data/test.png'));
    const formHeader = { ...headers };
    formHeader['Content-Type'] = 'multipart/form-data';
    const res = await request(app)
      .post(
        `/api/v1/users/${1}/bathingspots/${spotRes.body.data[0].id}/models/${
          modelRes.body.data[0].id
        }/upload/plot`,
      )
      .field('title', 'foo')
      .field('description', 'bah')
      .field(
        'upload',
        fs.createReadStream(path.resolve(__dirname, '../../data/oval.svg')),
      )
      .set(formHeader);

    expect(res.body.data[0].title).toBe('foo');
    expect(res.body.data[0].description).toBe('bah');
    expect(res.status).toBe(201);
    done();
  });

  test('should post image file to spot', async (done) => {
    const form = new FormData();

    form.append('name', 'Multer');
    form.append('upload', path.resolve(__dirname, '../../data/test.png'));
    const formHeader = { ...headers };
    formHeader['Content-Type'] = 'multipart/form-data';
    const res = await request(app)
      .post(`/api/v1/users/${1}/bathingspots/1/images/upload`)
      .field(
        'upload',
        fs.createReadStream(path.resolve(__dirname, '../../data/test.png')),
      )
      .set(formHeader);
    expect(res.status).toBe(201);
    done();
  });

  test('should return 400 due to wrong route', async (done) => {
    const form = new FormData();

    form.append('name', 'Multer');
    form.append('upload', path.resolve(__dirname, '../../data/test.png'));
    const formHeader = { ...headers };
    formHeader['Content-Type'] = 'multipart/form-data';
    const res = await request(app)
      .post(`/api/v1/users/${1}/bathingspots/1/rains/upload`)
      .field(
        'upload',
        fs.createReadStream(path.resolve(__dirname, '../../data/test.png')),
      )
      .set(formHeader);

    expect(res.status).toBe(400);
    done();
  });

  test('should return 500 due to wrong route', async (done) => {
    const form = new FormData();

    form.append('name', 'Multer');
    form.append('upload', path.resolve(__dirname, '../../data/test.png'));
    const formHeader = { ...headers };
    formHeader['Content-Type'] = 'multipart/form-data';
    const res = await request(app)
      .post(`/api/v1/users/${1}/bathingspots/1/images/upload`)

      .set(formHeader);

    expect(res.status).toBe(500);
    done();
  });
}); // end of describe
