jest.useFakeTimers();
import { BathingspotRawModelData } from '../src/orm/entity/BathingspotRawModelData';
import { BathingspotPrediction } from '../src/orm/entity/BathingspotPrediction';
import { BathingspotModel } from '../src/orm/entity/BathingspotModel';
import { Bathingspot } from '../src/orm/entity/Bathingspot';
import routes from '../src/lib/routes';
import request from 'supertest';
import { Application } from 'express';
import { Connection, createConnection, getConnection } from 'typeorm';
import { User } from '../src/orm/entity/User';
import { Questionaire } from '../src/orm/entity/Questionaire';
import { UserRole, Regions } from '../src/lib/types-interfaces';
import { Region } from '../src/orm/entity/Region';
let connection: Connection;
import express = require('express');
let app: Application;

beforeAll((done) => {
  if(process.env.NODE_ENV !== 'test'){
    throw new Error('We are not in the test env this is harmful tables will be dropped');
  }
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/v1/', routes);

    const p = createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres_password',
      database: 'postgres',
      synchronize: true,
      logging: false,
      dropSchema: true,
      entities: [
        User,
        Region,
        Questionaire,
        Bathingspot,
        BathingspotModel,
        BathingspotPrediction,
        BathingspotRawModelData
      ],
    });

    p.then(con => {
      // const db = await con.connect();
      // process.stdout.write(db.name);
        con.manager.save(createProtectedUser()).then(() => {
          let user = new User();
          user.firstName = 'James';
          user.lastName = 'Bond';
          user.role = UserRole.creator;
          user.email = 'faker@fake.com';
          const spot = new Bathingspot();
          const region = new Region();
          region.name = Regions.berlinbrandenburg;
          spot.region = region;
          spot.isPublic = true;
          spot.name = 'billabong';
          user.bathingspots = [spot];
          con.manager.save(region).then(() => {
            con.manager.save(spot).then(() => {
              con.manager.save(user).then(() => {
                connection = con;
                done();
                console.log('done with beforeAll setup');
              }).catch(err => { throw err });
            }).catch(err => { throw err });
          }).catch(err => { throw err });
        }).catch(err => { throw err });
      }).catch(err => { throw err });
  });

  afterAll((done) => {
    connection.dropDatabase().then(() => {
      connection.close().then(() => {
        console.log('Done with cleanup after all');
        done();
      }).catch(err => { throw err });
    }).catch(err => { throw err });
  });


describe('testing get bathingspots', () => {

  test.skip('route should fail due to wrong route', async (done) => {
    expect.assertions(2);
    const res = await request(app).get('/api/v1/');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    done();
  });

  test('route get bathingspots', async (done) => {
    expect.assertions(2);
    const res = await request(app).get('/api/v1/bathingspots');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    done();
  });

  test('route get bathingspot by id', async (done) => {
    expect.assertions(2);
    const res = await request(app).get('/api/v1/bathingspots/1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    done();
  });

  test('route get single bathingspot should fail due to worng id', async (done) => {
    expect.assertions(2);
    const res = await request(app).get(`/api/v1/bathingspots/${100000}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    done();
  });
});


