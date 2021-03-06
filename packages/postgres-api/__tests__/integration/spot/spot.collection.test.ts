import 'reflect-metadata';

import {
  BathingspotMeasurement,
  BathingspotModel,
  Discharge,
  GlobalIrradiance,
  PurificationPlant,
} from '../../../src/orm/entity';
import {
  closeTestingConnections,
  createTestingConnections,
  randomString,
  readTokenFromDisc,
  reloadTestingDatabases,
} from '../../test-utils';
import express, { Application } from 'express';
import {
  getColletionItemById,
  getGIWithRelations,
  getPPlantWithRelations,
} from '../../../src/lib/utils/collection-repo-helpers';

import { BathingspotPrediction } from '../../../src/orm/entity/BathingspotPrediction';
import { Connection } from 'typeorm';
import { GenericInput } from '../../../src/orm/entity/GenericInput';
import { PredictionValue, ModelParamter } from '../../../src/lib/common/index';
import path from 'path';
import request from 'supertest';
import routes from '../../../src/lib/routes';

jest.useFakeTimers();

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
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});
describe('testing bathingspots collection', () => {
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

  // ╔═╗╔═╗╔═╗╔╦╗
  // ╠═╝║ ║╚═╗ ║
  // ╩  ╚═╝╚═╝ ╩

  test('post collection item should expect array or object', async (done) => {
    const arr = [
      {
        comment: 'This is a bulk post 1',
        date: '2019-12-31 00:00:01',
        dateTime: '12:00:01',
        value: Math.random() * 10,
      },
      {
        comment: 'This is a bulk post 2',
        date: '2019-12-31 00:00:00',
        dateTime: '12:00:02',
        value: Math.random() * 10,
      },
    ];
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/rains')
      .send(arr)
      .set(headers);
    expect(res.status).toBe(201);
    done();
  });

  test('route POST users bathingspots collection rains', async (done) => {
    const obj = {
      comment: 'This is a test',
      date: '2019-12-31 15:00:00',
      dateTime: '12:00:03',
      value: Math.random() * 10,
    };
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/rains')
      .send(obj)
      .set(headers);
    // console.log(res.body);
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].comment).toBe(obj.comment);
    done();
  });
  test('route DELETE users bathingspots collection rains', async (done) => {
    const obj = {
      comment: 'This is a test',
      date: '2025-12-31',
      dateTime: '12:00:01',
      value: Math.random() * 10,
    };
    const resPost = await request(app)
      .post('/api/v1/users/1/bathingspots/1/rains')
      .send(obj)
      .set(headers);
    const res = await request(app)
      .delete(`/api/v1/users/1/bathingspots/1/rains/${resPost.body.data[0].id}`)
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].comment).toBe(obj.comment);
    done();
  });
  test('route POST users bathingspots collection genericInputs measurements', async (done) => {
    const obj = {
      comment: 'This is a test',
      date: '2019-12-31',
      dateTime: '12:00:01',
      value: Math.random() * 10,
    };
    await request(app)
      .post('/api/v1/users/1/bathingspots/1/genericInputs/')
      .send({ name: 'foo' })
      .set(headers);
    // console.log(resg.body);
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/genericInputs/1/measurements')
      .send(obj)
      .set(headers);
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].comment).toBe(obj.comment);
    done();
  });

  test('route BULK POST users bathingspot collection genericInputs measurement', async (done) => {
    const arr = [
      {
        comment: 'This is a bulk test 1',
        date: '2019-12-30',
        dateTime: '12:00:01',
        value: Math.random() * 10,
      },
      {
        comment: 'This is a bulk test 2',
        date: '2019-12-31',
        dateTime: '12:00:02',
        value: Math.random() * 10,
      },
    ];
    const resCreate = await request(app)
      .post('/api/v1/users/1/bathingspots/1/genericInputs/')
      .send({ name: 'bulk' })
      .set(headers);
    // console.log(resCreate.body);
    const res = await request(app)
      .post(
        `/api/v1/users/1/bathingspots/1/genericInputs/${resCreate.body.data[0].id}/measurements`,
      )
      .send(arr)
      .set(headers);
    expect(res.status).toBe(201);
    expect(res.body.data.length).toBe(2);
    expect(res.body.success).toBe(true);

    // console.log(res);
    done();
  });

  test('getColletionItemById should return specific entitiy GenericInput', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/genericInputs/')
      .send({ name: 'foo' })
      .set(headers);
    const entity = await getColletionItemById(
      res.body.data[0].id,
      'GenericInput',
    );
    expect(entity instanceof GenericInput).toBe(true);
    done();
  });
  test('getColletionItemById should return specific entitiy PurificationPlant', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/purificationPlants/')
      .send({ name: 'foo' })
      .set(headers);
    const entity = await getColletionItemById(
      res.body.data[0].id,
      'PurificationPlant',
    );
    expect(entity instanceof PurificationPlant).toBe(true);
    done();
  });

  test('getColletionItemById should return specific entitiy Discharge', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/discharges/')
      .send({ dateTime: '12:00:00', date: '2019-12-31', value: 1 })
      .set(headers);
    const entity = await getColletionItemById(res.body.data[0].id, 'Discharge');
    expect(entity instanceof Discharge).toBe(true);
    done();
  });

  test('getColletionItemById should return specific entitiy GlobalIrradiance', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/globalIrradiances/')
      .send({ dateTime: '12:00:00', date: '2019-12-31', value: 1 })
      .set(headers);
    const entity = await getColletionItemById(
      res.body.data[0].id,
      'GlobalIrradiance',
    );
    expect(entity instanceof GlobalIrradiance).toBe(true);
    done();
  });

  test('route get users bathingspots collection rains', async (done) => {
    const res = await request(app)
      .get('/api/v1/users/1/bathingspots/1/rains')
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.success).toBe(true);
    done();
  });

  test('getColletionItemById should return specific entitiy BathingspotMeasurement', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/measurements/')
      .send({ dateTime: '12:00:00', date: '2019-12-31', value: 1 })
      .set(headers);
    const entity = await getColletionItemById(
      res.body.data[0].id,
      'BathingspotMeasurement',
    );
    expect(entity instanceof BathingspotMeasurement).toBe(true);
    done();
  });
  test('getColletionItemById should return specific entitiy BathingspotModel', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/models/')
      .send({
        dateTime: '12:00:00',
        date: '2019-12-31',
        rmodel: '',
        parameter: ModelParamter.conc_ec,
      })
      .set(headers);
    const entity = await getColletionItemById(
      res.body.data[0].id,
      'BathingspotModel',
    );
    expect(entity instanceof BathingspotModel).toBe(true);
    done();
  });

  test('getColletionItemById should return specific entitiy BathingspotPrediction', async (done) => {
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/predictions/')
      .send({
        date: '2019-12-31',
        dateTime: '12:00:00',
        prediction: PredictionValue.ausgezeichnet,
      })
      .set(headers);
    const entity = await getColletionItemById(
      res.body.data[0].id,
      'BathingspotPrediction',
    );
    expect(entity instanceof BathingspotPrediction).toBe(true);
    done();
  });
  test('getColletionItemById should throw an error', async (done) => {
    // const res = await request(app)
    //   .post('/api/v1/users/1/bathingspots/1/genericInputs/')
    //   .send({ name: 'foo' })
    //   .set(headers);
    // const entity = await
    expect(getColletionItemById('1', randomString())).rejects.toBeInstanceOf(
      Error,
    );
    done();
  });
  test('getColletionItemById should return undefiend', async (done) => {
    expect(getPPlantWithRelations('100')).resolves.toBe(undefined);
    done();
  });
  test('getColletionItemById should throw an error', async (done) => {
    expect(getGIWithRelations('100')).resolves.toBe(undefined);
    done();
  });

  // PUT

  test('PUT non existing collection item', async (done) => {
    const userData = {
      firstName: 'foo',
      role: 'creator',
      email: 'foo@Bathingspot.com',
      lastName: 'bah',
    };
    const spotData = { name: 'foo', isPublic: true };
    const userRes = await request(app)
      .post(`/api/v1/users`)
      .send(userData)
      .set(headers);
    const user = userRes.body.data[0];

    const spotRes = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots`)
      .send(spotData)
      .set(headers);

    const spot = spotRes.body.data[0];
    const putRes = await request(app)
      .put(`/api/v1/users/${user.id}/bathingspots/${spot.id}/rains/${10000}`)
      .send({ value: 123 })
      .set(headers);

    expect(user).toBeDefined(); // SETUP
    expect(spot).toBeDefined(); // SETUP

    expect(putRes.status).toBe(404);
    done();
  });
  test('PUT collection item', async (done) => {
    const userData = {
      firstName: 'foo',
      role: 'creator',
      email: 'foo@Bathingspot.com',
      lastName: 'bah',
    };
    const spotData = { name: 'foo', isPublic: true };
    const userRes = await request(app)
      .post(`/api/v1/users`)
      .send(userData)
      .set(headers);
    const user = userRes.body.data[0];

    const spotRes = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots`)
      .send(spotData)
      .set(headers);

    const spot = spotRes.body.data[0];

    const postRes = await request(app)
      .post(`/api/v1/users/${user.id}/bathingspots/${spot.id}/rains/`)
      .send({ value: 123, date: '2020-11-11 00:00:00' })
      .set(headers);

    const rain = postRes.body.data[0];
    const putNonExistingRes = await request(app)
      .put(`/api/v1/users/${user.id}/bathingspots/${spot.id}/rains/${10000}`)
      .send({ value: 123 })
      .set(headers);

    const putNonExistingRouteRes = await request(app)
      .put(
        `/api/v1/users/${user.id}/bathingspots/${spot.id}/rains/${
          rain.id
        }/measurements/${10000}`,
      )
      .send({ value: 123 })
      .set(headers);

    expect(user).toBeDefined(); // SETUP
    expect(spot).toBeDefined(); // SETUP
    expect(rain).toBeDefined(); // SETUP

    expect(putNonExistingRes.status).toBe(404);
    expect(putNonExistingRouteRes.status).toBe(404);
    done();
  });
  // ┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐
  //  ││├┤ │  ├┤  │ ├┤
  // ─┴┘└─┘┴─┘└─┘ ┴ └─┘

  test('testing delete fail for not existing element', async (done) => {
    const res = await request(app)
      .delete('/api/v1/users/1/bathingspots/1/predictions/100')
      .set(headers);
    expect(res.status).toBe(404);
    done();
  });
});
