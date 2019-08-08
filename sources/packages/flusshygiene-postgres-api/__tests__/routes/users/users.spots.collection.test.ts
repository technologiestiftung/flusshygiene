jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection } from 'typeorm';
import routes from '../../../src/lib/routes';
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
        sicht: 1000000,
        date: '2000-05-16T00:00:00.000Z',
        conc_ec: 126000,
        conc_ec_txt: '126000',
        oldId: 18,
        detailId: 344351,
        conc_ie: 15000,
        conc_ie_txt: '<15000',
        temp: 21000,
        algen: false,
        cb: 720000,
        sichtTxt: '>100000',
        tempTxt: '21,00000',
        algenTxt: '',
        bsl: 'B329',
        state: 'gruen',
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
        value: 1000,
        dateTime: '05:23:42',
        date: '08-Jan-1999',
        comment: 'This is a comment, can be NULL',
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
        value: 1000,
        dateTime: '05:23:42',
        date: '08-Jan-1999',
        comment: 'This is a comment, can be NULL',
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
        value: 1000,
        dateTime: '05:23:42',
        date: '08-Jan-1999',
        comment: 'This is a comment, can be NULL',
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
        rmodel: 'string dataaaa',
        comment: 'This is another test',
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
