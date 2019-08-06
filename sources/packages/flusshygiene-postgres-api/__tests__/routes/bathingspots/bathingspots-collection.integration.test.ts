import { PredictionValue } from './../../../src/lib/common/index';
import { BathingspotPrediction } from './../../../src/orm/entity/BathingspotPrediction';
import { Discharge } from './../../../src/orm/entity/Discharge';
import { GenericInput } from './../../../src/orm/entity/GenericInput';
jest.useFakeTimers();
import express, { Application } from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { Connection } from 'typeorm';
import routes from '../../../src/lib/routes';
import path from 'path';
import {
  closeTestingConnections,
  createTestingConnections,
  reloadTestingDatabases,
  readTokenFromDisc,
} from '../../test-utils';
import { async } from 'rxjs/internal/scheduler/async';
import {
  getColletionItemById,
  getPPlantWithRelations,
  getGIWithRelations,
} from '../../../src/lib/utils/collection-repo-helpers';
import {
  Discharge,
  GlobalIrradiance,
  BathingspotModel,
  BathingspotMeasurement,
  PurificationPlant,
} from '../../../src/orm/entity';

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

  test('route get users bathingspots collection rains', async (done) => {
    const res = await request(app)
      .get('/api/v1/users/1/bathingspots/1/rains')
      .set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.success).toBe(true);
    done();
  });

  test('route POST users bathingspots collection rains', async (done) => {
    const obj = {
      value: Math.random() * 10,
      dateTime: '12:00:01',
      date: '2019-12-31',
      comment: 'This is a test',
    };
    const res = await request(app)
      .post('/api/v1/users/1/bathingspots/1/rains')
      .send(obj)
      .set(headers);
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].comment).toBe(obj.comment);
    done();
  });
  test('route DELETE users bathingspots collection rains', async (done) => {
    const obj = {
      value: Math.random() * 10,
      dateTime: '12:00:01',
      date: '2019-12-31',
      comment: 'This is a test',
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
      value: Math.random() * 10,
      dateTime: '12:00:01',
      date: '2019-12-31',
      comment: 'This is a test',
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
      .send({ dateTime: '12:00:00', date: '2019-12-31', rmodel: '' })
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
        dateTime: '12:00:00',
        date: '2019-12-31',
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
    expect(getColletionItemById('1', 'foo')).rejects.toThrow(Error);
    done();
  });
  test('getColletionItemById should throw an error', async (done) => {
    // const res = await request(app)
    //   .post('/api/v1/users/1/bathingspots/1/genericInputs/')
    //   .send({ name: 'foo' })
    //   .set(headers);
    // const entity = await
    expect(getPPlantWithRelations('1')).rejects.toThrow(Error);
    done();
  });
  test('getColletionItemById should throw an error', async (done) => {
    // const res = await request(app)
    //   .post('/api/v1/users/1/bathingspots/1/genericInputs/')
    //   .send({ name: 'foo' })
    //   .set(headers);
    // const entity = await
    expect(getGIWithRelations('1')).rejects.toThrow(Error);
    done();
  });
});
