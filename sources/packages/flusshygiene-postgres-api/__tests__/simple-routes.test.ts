import { apiVersion } from './../src/lib/common/index';
import express = require('express');
import request from 'supertest';
import routes from '../src/lib/routes';
import {
  defaultGetResponse,
  defaultPostResponse,
  wrongRoute,
} from './../src/lib/request-handlers/defaults';
import path from 'path';
import { readTokenFromDisc } from './test-utils';

const { version } = require('../package.json');

const token = readTokenFromDisc(path.resolve(__dirname, './.test.token.json'));
const headers = {
  authorization: `${token.token_type} ${token.access_token}`,
  Accept: 'application/json',
};

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
    expect(response.body).toEqual({ success: true, apiVersion: version });
    done();
  });
  test('route default post', async (done) => {
    const response = await request(app)
      .post('/default/post')
      .send({})
      .set(headers);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true, apiVersion: version });
    done();
  });
  test('route default wrong route', async (done) => {
    const response = await request(app).get('/default/wrong');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, apiVersion: version });
    done();
  });
});
