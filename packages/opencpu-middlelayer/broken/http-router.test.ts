import redis from 'redis';
import redis_mock from 'redis-mock';
const mockedRedis = jest
  .spyOn(redis, 'createClient')
  .mockImplementation(redis_mock.createClient);

import * as passThrough from '../src/post-pass-through';

import { BroadCaster } from '../src/events-broadcaster';
import { app } from '../src/app';
import nock from 'nock';
import request from 'supertest';
// import { logger } from '../src/logger';

jest.useFakeTimers();
const scope = nock('http://localhost:4444')
  .post('/middlelayer/calibrate')
  .reply(201, {})
  .post('/middlelayer/predict')
  .reply(201, {})
  .post('/middlelayer/model')
  .reply(201, {})
  .post('/middlelayer/foo/bah')
  .reply(201, {});

afterAll(() => {
  mockedRedis.mockRestore();
  logger.transports.forEach((elem) => {
    elem.silent = false;
  });
});
beforeAll(() => {
  logger.transports.forEach((elem) => {
    elem.silent = true;
  });
});

describe.skip('basic route tests', () => {
  test('should responde with success on calibrate', async (done) => {
    const response = await request(app)
      .post('/middlelayer/calibrate')
      .set('Cookie', ['connect.sid=4e89f412-cad5-4787-8d98-20212336b2c5'])
      .send({ url: 'http://localhost:4444/foo/bah', payload: {} });
    expect(response.status).toBe(201);
    expect(response.body).toMatchSnapshot({
      sessionID: expect.any(String),
      version: expect.any(String),
    });
    done();
  });
  test('should responde with success on predict', async (done) => {
    const response = await request(app)
      .post('/middlelayer/predict')
      .send({ url: 'http://localhost:4444/foo/bah', payload: {} });
    expect(response.status).toBe(201);
    expect(response.body).toMatchSnapshot({
      sessionID: expect.any(String),
      version: expect.any(String),
    });
    done();
  });
  test('should responde with success on model', async (done) => {
    const response = await request(app)
      .post('/middlelayer/model')
      .send({ url: 'http://localhost:4444/foo/bah', payload: {} });
    expect(response.status).toBe(201);
    expect(response.body).toMatchSnapshot({
      sessionID: expect.any(String),
      version: expect.any(String),
    });
    done();
  });

  test('should respond with 404 on non existing route', async (done) => {
    const response = await request(app)
      .post('/middlelayer/foo')
      .send({});
    // console.log(response);
    expect(response.status).toBe(404);
    expect(response.text).toMatchSnapshot();
    done();
  });

  test('should respond with forbidden on sleep in production', async (done) => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    // console.log('we are on production', process.env.NODE_ENV);
    const response = await request(app)
      .post('/middlelayer/sleep')
      .send({ seconds: 10 });
    expect(response.status).toBe(403);
    process.env.NODE_ENV = oldEnv;
    done();
  });
  test.todo(
    'should respond with 404 due to missing payload' /*, async (done) => {
    const response = await request(app)
      .post('/middlelayer/calibrate')
      .send({ url: 'http://localhost:4444/foo/bah' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    done();
  }*/,
  );

  test('should call broadcaster after working request', async (done) => {
    const broadcaster = BroadCaster.getInstance();
    const mockBroadcaster = jest.spyOn(broadcaster, 'emit');
    await request(app)
      .post('/middlelayer/model')
      .send({ url: 'http://localhost:4444/foo/bah', payload: {} });
    expect(mockBroadcaster).toHaveBeenCalled();
    mockBroadcaster.mockRestore();
    done();
  });
  test('should call broadcaster after working request', async (done) => {
    const broadcaster = BroadCaster.getInstance();
    const mockBroadcasterEmit = jest.spyOn(broadcaster, 'emit');
    const mockPassthrough = jest.spyOn(passThrough, 'postPassThrough');
    await request(app)
      .post('/middlelayer/model')
      .send({ url: 'http://localhost:4444/foo/bah', payload: {} });
    expect(mockBroadcasterEmit).toHaveBeenCalled();
    expect(mockPassthrough).toHaveBeenCalled();
    // console.log(mockBroadcasterEmit.mock);
    // console.log(mockPassthrough.mock);
    expect(mockPassthrough.mock.results[0].value).resolves.toBe({});
    mockPassthrough.mockRestore();
    mockBroadcasterEmit.mockRestore();
    done();
  });
});
