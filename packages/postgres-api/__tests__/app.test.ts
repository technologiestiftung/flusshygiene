jest.useFakeTimers();
import request from 'supertest';
import app from '../src/lib/app';
// let rclient: redis.RedisClient;
beforeAll(() => {});
afterAll(() => {});
describe('default testing get requests', () => {
  test.todo(
    'should response with 200 on / on ping route' /*, async () => {
    expect.assertions(2);
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toMatchSnapshot();
  }*/,
  );
});
