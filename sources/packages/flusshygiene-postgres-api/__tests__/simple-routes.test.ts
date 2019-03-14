import { defaultPostResponse, defaultGetResponse, wrongRoute } from './../src/lib/request-handlers/defaults';
import routes from '../src/lib/routes';
import request from 'supertest';
import express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/default/post', defaultPostResponse);
app.use('/default/get', defaultGetResponse);
app.use('/default/wrong', wrongRoute);

app.use('/api/v1/', routes);

describe('default route requests', () => {

  test('route default get', async (done) => {
    const response = await request(app).get('/default/get');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ "success": true });
    done();
  });
  test('route default post', async (done) => {
    const response = await request(app).post('/default/post')
      .send({})
      .set('Accept', 'application/json');;
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ "success": true });
    done();
  });
  test('route default wrong route', async (done) => {
    const response = await request(app).get('/default/wrong');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ "success": false });
    done();
  });
});

