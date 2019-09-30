import * as passThrough from '../src/post-pass-through';

import { BroadCaster } from '../src/events-broadcaster';
import app from '../src/app';
import nock from 'nock';
import request from 'supertest';
import { resolve } from 'url';

jest.useFakeTimers();
const scope = nock('http://localhost:4444')
  .post('/calibrate')
  .reply(201, {})
  .post('/predict')
  .reply(201, {})
  .post('/model')
  .reply(201, {})
  .post('/foo/bah')
  .reply(201, {});

describe('basic route tests', () => {
  test('should responde with success on clibrate', async (done) => {
    const response = await request(app)
      .post('/calibrate')
      .send({ url: 'http://localhost:4444/foo/bah', payload: {} });
    expect(response.status).toBe(201);
    expect(response.body).toMatchSnapshot();
    done();
  });
  test('should responde with success on predict', async (done) => {
    const response = await request(app)
      .post('/predict')
      .send({ url: 'http://localhost:4444/foo/bah', payload: {} });
    expect(response.status).toBe(201);
    expect(response.body).toMatchSnapshot();
    done();
  });
  test('should responde with success on model', async (done) => {
    const response = await request(app)
      .post('/model')
      .send({ url: 'http://localhost:4444/foo/bah', payload: {} });
    expect(response.status).toBe(201);
    expect(response.body).toMatchSnapshot();
    done();
  });

  test('should respond with 404 on non existing route', async (done) => {
    const response = await request(app)
      .post('/foo')
      .send({});
    // console.log(response);
    expect(response.status).toBe(404);
    expect(response.text).toMatchSnapshot();
    done();
  });

  test('should respond with 404 due to missing payload', async (done) => {
    const response = await request(app)
      .post('/calibrate')
      .send({ url: 'http://localhost:4444/foo/bah' });
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    done();
  });

  test('should call broadcaster after working request', async (done) => {
    const broadcaster = BroadCaster.getInstance();
    const mockBroadcaster = jest.spyOn(broadcaster, 'emit');
    await request(app)
      .post('/model')
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
      .post('/model')
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
