import app from '../src/app';
import request from 'supertest';

describe('basic route tests', () => {
  test('should responde with success on calibrate', async (done) => {
    const response = await request(app)
      .post('/calibrate')
      .send({ url: 'http://localhost:4444/foo/bah', payload: {} });
    expect(response.status).toBe(201);
    expect(response.body).toMatchSnapshot();
    done();
  });
  test('should responde with success on calibrate', async (done) => {
    const response = await request(app)
      .post('/predict')
      .send({ url: 'http://localhost:4444/foo/bah', payload: {} });
    expect(response.status).toBe(201);
    expect(response.body).toMatchSnapshot();
    done();
  });
  test('should responde with success on calibrate', async (done) => {
    const response = await request(app)
      .post('/model')
      .send({ url: 'http://localhost:4444/foo/bah', payload: {} });
    expect(response.status).toBe(201);
    expect(response.body).toMatchSnapshot();
    done();
  });
});
