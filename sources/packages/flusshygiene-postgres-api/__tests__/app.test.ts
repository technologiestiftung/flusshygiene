
import request from 'supertest';
jest.mock('pg');
import app from '../src/lib/app';
// let rclient: redis.RedisClient;
jest.useFakeTimers();

beforeAll(() => {
});
afterAll(() => {
});
describe('default testing get requests', () => {
  test('should response with 200 on /', async () => {
    expect.assertions(2);
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toMatchSnapshot();
  });
});
