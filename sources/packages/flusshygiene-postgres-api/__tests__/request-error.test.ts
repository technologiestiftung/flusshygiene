/**
 * lets assume the the DB connection does not esist
 * all request should throw internal server errors
 *
 */
import { Application } from 'express';
import express = require('express');
import request from 'supertest';
import { getBathingspots, getSingleBathingspot } from '../src/lib/request-handlers/bathingspots';
import routes from '../src/lib/routes';
import path from 'path';
import { readTokenFromDisc, createTestingConnections, closeTestingConnections } from './test-utils';
import { Connection } from 'typeorm';
let app: Application;
const token = readTokenFromDisc(path.resolve(__dirname, './.test.token.json'));
const headers = { authorization: `${token.token_type} ${token.access_token}`,Accept: 'application/json' };

beforeAll(() => {
});
describe('testing missing db connection', () => {
  let app: Application;
  let connections: Connection[];
  beforeAll(async (done) => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/v1/', routes);
    app.use('/test/spots', getBathingspots);
    app.use('/test/spots/noid', getSingleBathingspot);
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('We are not in the test env this is harmful tables will be dropped');
    }
    connections = await createTestingConnections();
    await closeTestingConnections(connections);

    done();
  });

  it('should be 500 on test route ', async (done) => {
    const res = await request(app).get('/test/spots').set(headers);
    expect(res.status).toBe(500);
    done();
  });
  it('should throw an error on test route ', () => {
    // const res = await request(app).get('/test/spots/noid');
    return request(app).get('/test/spots/noid').catch(e => expect(e).toMatch('error'));
  });
  it('should return 500 on route getUsers', async (done) => {
    const res = await request(app).get('/api/v1/users').set(headers);
    expect(res.status).toBe(500);
    done();
  });
  it('should return 500 on route getUser id', async (done) => {
    const res = await request(app).get('/api/v1/users/1').set(headers);
    expect(res.status).toBe(500);
    done();
  });
  it.skip('should return 500 on route getUsers id bathingspots', async (done) => {
    const res = await request(app).get('/api/v1/users/1/bathingspots').set(headers);
    expect(res.status).toBe(500);
    done();
  });
  it.skip('should return 500 route getUsers id bathingspot id', async (done) => {
    const res = await request(app).get('/api/v1/users/1/bathingspots/1').set(headers);
    console.log('in test -> res', res);
    expect(res.status).toBe(500);
    done();
  });

  it.skip('should return 500 route post user id bathingspot', async (done) => {
    const res = await request(app)
    .post('/api/v1/users/1/bathingspots').send({name: 'foo', isPublic: true}).set(headers);
    expect(res.status).toBe(500);
    done();
  });

  it.skip('should return 500 route put user id bathingspot', async (done) => {
    const res = await request(app)
    .put('/api/v1/users/1/bathingspots/1').send({name: 'foo', isPublic: true}).set(headers);
    expect(res.status).toBe(500);
    done();
  });
  it.skip('should return 500 route delete user id bathingspot', async (done) => {
    const res = await request(app)
    .delete('/api/v1/users/1/bathingspots/1').send({force: true}).set(headers);
    expect(res.status).toBe(500);
    done();
  });
  it.skip('should return 500 on route post new user due to missing connection', async (done) => {
    const res = await request(app).post('/api/v1/users').set(headers);
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    // update user
    done();
  });
  it('should return 500 on route post new user', async (done) => {
    const res = await request(app).post('/api/v1/users').send({
      email: 'lilu@fifth-element.com',
      firstName: 'Lilu',
      lastName: 'Mulitpass',
      role: 'reporter',
    })
      .set(headers);
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    // update user
    done();
  });
  it('should return 500 on route post new user', async (done) => {
    const res = await request(app).post('/api/v1/users').send({
      email: 'lilu@fifth-element.com',
      firstName: 'Lilu',
      lastName: 'Mulitpass',
      role: 'reporter',
    })
      .set(headers);
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    // update user
    done();
  });
  it('should return 500 on put user by id', async (done) => {
    const res = await request(app).put('/api/v1/users/1').set(headers);
    expect(res.status).toBe(500);
    // delete user
    done();
  });
  it('should return 500 on delete user by id', async (done) => {
    const res = await request(app).delete('/api/v1/users/1').set(headers);
    expect(res.status).toBe(500);
    // get all bathingspots
    done();
  });

  it('should return 500 on route get all bathingspots', async (done) => {
    // getBathingspots);
    const res = await request(app).get('/api/v1/bathingspots').set(headers);
    expect(res.status).toBe(500);
    done();
  });
  it('should return 500 get bathingspot by id', async (done) => {
    // getBathingspot);
    const res = await request(app).get('/api/v1/bathingspots/1').set(headers);
    expect(res.status).toBe(500);
    done();
  });

  it('should return 404 post bathingspot by id', async (done) => {
    // getBathingspot);
    const res = await request(app)
    .post('/api/v1/bathingspots').send({name: 'foo', isPublic: true}).set(headers);
    expect(res.status).toBe(404);
    done();
  });

  it('should return 500 get regions', async (done) => {
    // getBathingspot);
    const res = await request(app)
    .get('/api/v1/regions').set(headers);
    expect(res.status).toBe(500);
    done();
  });
  it('should return 500 get regions by id', async (done) => {
    // getBathingspot);
    const res = await request(app)
    .get('/api/v1/regions/1').set(headers);
    expect(res.status).toBe(500);
    done();
  });
  it('should return 500 put regions by id', async (done) => {
    // getBathingspot);
    const res = await request(app)
    .put('/api/v1/regions/1').send({displayName: 'pony and rainbows'}).set(headers);
    expect(res.status).toBe(500);
    done();
  });
  it('should return 500 post regions', async (done) => {
    // getBathingspot);
    const res = await request(app)
    .post('/api/v1/regions').send({displayName: 'pony and rainbows', name: 'rainbow'}).set(headers);
    // console.log(res);
    expect(res.status).toBe(500);
    done();
  });
  it('should return 500 delete region by id', async (done) => {
    // getBathingspot);
    const res = await request(app)
    .delete('/api/v1/regions/1').set(headers);
    // console.log(res);
    expect(res.status).toBe(500);
    done();
  });
});
