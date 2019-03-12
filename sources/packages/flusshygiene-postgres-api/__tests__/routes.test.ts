jest.useFakeTimers();
import { BathingspotRawModelData } from './../src/orm/entity/BathingspotRawModelData';
import { BathingspotPrediction } from './../src/orm/entity/BathingspotPrediction';
import { BathingspotModel } from './../src/orm/entity/BathingspotModel';
import { Bathingspot } from './../src/orm/entity/Bathingspot';
import routes from '../src/lib/routes';
import request from 'supertest';
import express from 'express';
import {createConnection, getRepository, Connection} from 'typeorm';
import { User } from '../src/orm/entity/User';
import { Questionaire } from './../src/orm/entity/Questionaire';
import { UserRole } from '../src/lib/types-interfaces';
let connection: Connection;
afterAll(async ()=>{
  if(connection !== undefined){
    await connection.close();
  }
});
beforeAll(async ()=>{
  try{
    connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres_password',
      database: 'postgres',
      entities: [
        User,
        Questionaire,
        Bathingspot,
        BathingspotModel,
        BathingspotPrediction,
        BathingspotRawModelData
      ]
  });
    // const db = await connection.connect();
    // process.stdout.write(db.name);
    let databaseEmpty:boolean = true;
    const users = await getRepository(User).find();
    process.stdout.write(`${users.length}\n`);
    if(users.length !== 0){
      databaseEmpty = false;
    }
    // process.stdout.write(`Users ${JSON.stringify(users)}\n`);
    if (databaseEmpty === true && process.env.NODE_ENV === 'development'){
      // gneerate some default data here
      let user = new User();
      user.firstName = 'James';
      user.lastName = 'Bond';
      user.role = UserRole.creator;
      user.email = 'faker@fake.com';
      await connection.manager.save(user);
    }
  }catch(error){
    throw error;
  }});
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/v1/', routes);
describe('default testing get requests', () => {
  test('route read/:id', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api/v1/read/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({"success": true});
  });
});
describe('default testing post requests', () => {
  test('route write', async () => {
    expect.assertions(2);
    const response = await request(app).post('/api/v1/write').send({});
    expect(response.status).toBe(201);
    expect(response.body).toEqual({success: true});
  });
});

describe('testing users', ()=>{
  test('route get users', async () => {
    expect.assertions(6);
    const res = await request(app).get('/api/v1/users');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('email');
    expect(res.body[0]).toHaveProperty('firstName');
    expect(res.body[0]).toHaveProperty('lastName');
    expect(res.body[0]).toHaveProperty('role');
  });

  test('route get user by id', async () => {
    expect.assertions(2);
    const res = await request(app).get('/api/v1/users/1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('add user', async () => {
    // process.env.NODE_ENV = 'development';
    expect.assertions(2);
    const res = await request(app).post('/api/v1/users').send({
      firstName: 'Lilu',
      lastName: 'Mulitpass',
      email: 'lilu@fifth-element.com',
      role: 'reporter'
    })
    .set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
  test('update user', async () => {
    // process.env.NODE_ENV = 'development';
    expect.assertions(2);
    const usersres = await request(app).get('/api/v1/users');
    const id = usersres.body[usersres.body.length - 1].id;
    const res = await request(app).put(`/api/v1/users/${id}`).send({
      email: 'foo@test.com',
    })
    .set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('delete users', async (done) => {
    process.env.NODE_ENV = 'development';
    const usersres = await request(app).get('/api/v1/users');
    expect.assertions(2);
    // for(let i = usersres.body.length -1; i >=0;i--){
      const id = usersres.body[usersres.body.length - 1].id;
      console.log(id);
      const res = await request(app).delete(`/api/v1/users/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      console.log(res.body);
    // }
    done();
  });
});
