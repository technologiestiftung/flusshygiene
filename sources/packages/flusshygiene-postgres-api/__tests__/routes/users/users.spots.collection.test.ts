jest.useFakeTimers();
import express, { Application } from 'express';
import path from 'path';
import 'reflect-metadata';
import request from 'supertest';
import { Connection } from 'typeorm';
import routes from '../../../src/lib/routes';
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
  Accept: 'application/json',
  authorization: `${token.token_type} ${token.access_token}`,
};

describe('GET all collection tyoe', () => {
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

  //     ██╗ ██╗
  //    ██╔╝██╔╝
  //   ██╔╝██╔╝
  //  ██╔╝██╔╝
  // ██╔╝██╔╝
  // ╚═╝ ╚═╝

  //  ██████╗ ███████╗████████╗
  // ██╔════╝ ██╔════╝╚══██╔══╝
  // ██║  ███╗█████╗     ██║
  // ██║   ██║██╔══╝     ██║
  // ╚██████╔╝███████╗   ██║
  //  ╚═════╝ ╚══════╝   ╚═╝
  // ███████╗ █████╗ ██╗██╗
  // ██╔════╝██╔══██╗██║██║
  // █████╗  ███████║██║██║
  // ██╔══╝  ██╔══██║██║██║
  // ██║     ██║  ██║██║███████╗
  // ╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝

  test(' should fail due to wrong user id route GET user by id spot by id predictions', async (done) => {
    const res = await request(app)
      .get('/api/v1/users/5/bathingspots/1/predictions')
      .set(headers);
    expect(res.status).toBe(404);
    expect(Array.isArray(res.body.success)).toBe(false);
    done();
  });
  test(' should fail due to wrong spot id route GET user by id spot by id predictions', async (done) => {
    const res = await request(app)
      .get('/api/v1/users/1/bathingspots/1000/predictions')
      .set(headers);
    expect(res.status).toBe(404);
    expect(Array.isArray(res.body.success)).toBe(false);
    done();
  });
  // ██████╗  █████╗ ███████╗███████╗
  // ██╔══██╗██╔══██╗██╔════╝██╔════╝
  // ██████╔╝███████║███████╗███████╗
  // ██╔═══╝ ██╔══██║╚════██║╚════██║
  // ██║     ██║  ██║███████║███████║
  // ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝

  test('route GET user by id spot by id predictions', async (done) => {
    const res = await request(app)
      .get('/api/v1/users/1/bathingspots/1/predictions')
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });

  test('route GET user by id spot by id measurements', async (done) => {
    const res = await request(app)
      .get('/api/v1/users/1/bathingspots/1/measurements')
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('route GET user by id spot by id discharges', async (done) => {
    const res = await request(app)
      .get('/api/v1/users/1/bathingspots/1/discharges')
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('route GET user by id spot by id rains', async (done) => {
    const res = await request(app)
      .get('/api/v1/users/1/bathingspots/1/rains')
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('route GET user by id spot by id globalIrradiances', async (done) => {
    const res = await request(app)
      .get('/api/v1/users/1/bathingspots/1/globalIrradiances')
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });

  test('route GET user by id spot by id models', async (done) => {
    const res = await request(app)
      .get('/api/v1/users/1/bathingspots/1/models')
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });

  test('route GET user by id spot by id models should not have field rmodel', async (done) => {
    await request(app)
      .post('/api/v1/users/1/bathingspots/1/models')
      .send({ rmodel: 'foo bah baz' })
      .set(headers);

    const res = await request(app)
      .get('/api/v1/users/1/bathingspots/1/models')
      .set(headers);
    expect(res.status).toBe(200);
    expect(res.body.data[0].rmodel).toBeUndefined();
    done();
  });

  test('route GET user by id spot by id purificationPlants', async (done) => {
    const res = await request(app)
      .get('/api/v1/users/1/bathingspots/1/purificationPlants')
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('route GET user by id spot by id genericInputs', async (done) => {
    const res = await request(app)
      .get('/api/v1/users/1/bathingspots/1/genericInputs')
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });

  // ██████╗  ██████╗ ███████╗████████╗
  // ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
  // ██████╔╝██║   ██║███████╗   ██║
  // ██╔═══╝ ██║   ██║╚════██║   ██║
  // ██║     ╚██████╔╝███████║   ██║
  // ╚═╝      ╚═════╝ ╚══════╝   ╚═╝

  test('route POST user by id spot by id predictions', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/predictions')
      .send({
        percentile2_5: null,
        percentile50: null,
        percentile90: null,
        percentile95: null,
        percentile97_5: null,
        credibleInterval2_5: null,
        credibleInterval97_5: null,
        oldId: 36,
        date: '2000-04-13T00:00:00.000Z',
        prediction: 'gut',
      })
      .set(headers);
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('route POST user by id spot by id measurements', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/measurements')
      .send({
        algen: false,
        algenTxt: '',
        bsl: 'B329',
        cb: 720000,
        conc_ec: 126000,
        conc_ec_txt: '126000',
        conc_ie: 15000,
        conc_ie_txt: '<15000',
        date: '2000-05-16T00:00:00.000Z',
        detailId: 344351,
        oldId: 18,
        sicht: 1000000,
        sichtTxt: '>100000',
        state: 'gruen',
        temp: 21000,
        tempTxt: '21,00000',
        wasserqualitaet: 1000,
        wasserqualitaetTxt: 1000,
      })
      .set(headers);
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('route POST user by id spot by id discharges', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/discharges')
      .send({
        comment: 'This is a comment, can be NULL',
        date: '08-Jan-1999',
        dateTime: '05:23:42',
        value: 1000,
      })
      .set(headers);
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('route POST user by id spot by id rains', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/rains')
      .send({
        comment: 'This is a comment, can be NULL',
        date: '08-Jan-1999',
        dateTime: '05:23:42',
        value: 1000,
      })
      .set(headers);
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('route POST user by id spot by id globalIrradiances', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/globalIrradiances')
      .send({
        comment: 'This is a comment, can be NULL',
        date: '08-Jan-1999',
        dateTime: '05:23:42',
        value: 1000,
      })
      .set(headers);
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('route POST user by id spot by id models', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/models')
      .send({
        comment: 'This is another test',
        rmodel: 'string dataaaa',
      })
      .set(headers);
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('route POST user by id spot by id purificationPlants', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/purificationPlants')
      .send({
        name: 'OberunterAmergau',
      })
      .set(headers);
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
  test('route POST user by id spot by id genericInputs', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/genericInputs')
      .send({
        name: 'OberunterAmergau',
      })
      .set(headers);
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
    done();
  });
});
