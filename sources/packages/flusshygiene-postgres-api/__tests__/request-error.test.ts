/**
 * lets assume the the DB connection does not esist
 * all reqesut should throw internal server errors
 *
 */
import routes from '../src/lib/routes';
import request from 'supertest';
import { Application } from 'express';
import express = require('express');
import { getBathingspots, getBathingspot } from '../src/lib/request-handlers/bathingspots';
let app: Application;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/v1/', routes);
  app.use('/test/spots', getBathingspots);
  app.use('/test/spots/noid', getBathingspot);
});
describe('testing missing db connection', () => {

  it('should be 500 on test route ',async(done)=>{
    const res = await request(app).get('/test/spots');
    expect(res.status).toBe(500);
    done();
  });
  it('should throw an error on test route ',()=>{
    // const res = await request(app).get('/test/spots/noid');
    return request(app).get('/test/spots/noid').catch(e => expect(e).toMatch('error'));

    // done();
  });
  it('should return 500 on route getUsers', async (done) => {
    // getUsers);
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(500);
    done();
  });
  it('should return 500 on route getUser id', async (done) => {
    // getUser);
    const res = await request(app).get('/api/v1/users/1');
    expect(res.status).toBe(500);
    done();
  });
  it('should return 500 on route getUsers id bathingspots', async (done) => {
    // getUserBathingspots);
    const res = await request(app).get('/api/v1/users/1/bathingspots');
    expect(res.status).toBe(500);
    done();
  });
  it('should return 500 route getUsers id bathingspot  id', async (done) => {
    // getOneUserBathingspotById);
    const res = await request(app).get('/api/v1/users/1/bathingspots/1');
    expect(res.status).toBe(500);
    done();
  });

  it('should return 500 on route post new user due to missing connection', async (done) => {
    // addUser);

    const res = await request(app).post('/api/v1/users');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    // update user
    done();
  });
  it('should return 500 on route post new user', async (done) => {
    // addUser);

    const res = await request(app).post('/api/v1/users').send({
      firstName: 'Lilu',
      lastName: 'Mulitpass',
      email: 'lilu@fifth-element.com',
      role: 'reporter'
    })
      .set('Accept', 'application/json');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    // update user
    done();
  });
  it('should return 500 on put user by id', async (done) => {
    // updateUser);
    const res = await request(app).put('/api/v1/users/1');
    expect(res.status).toBe(500);
    // delete user
    done();
  });
  it('should return 500 on delete user by id', async (done) => {
    // deleteUser)
    const res = await request(app).delete('/api/v1/users/1');
    expect(res.status).toBe(500);
    // get all bathingspots
    done();
  });


  it('should return 500 on route get all bathingspots', async (done) => {
    // getBathingspots);
    const res = await request(app).get('/api/v1/bathingspots');
    expect(res.status).toBe(500);
    done();
  });
  it('should return 500 get bathingspot by id', async (done) => {
    // getBathingspot);
    const res = await request(app).get('/api/v1/bathingspots/1');
    expect(res.status).toBe(500);
    done();
  });
});
