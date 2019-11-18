import redis from 'redis';
import redis_mock from 'redis-mock';
import request from 'supertest';

const mockedRedis = jest
  .spyOn(redis, 'createClient')
  .mockImplementation(redis_mock.createClient);
import app from '../src/app';
import { logger } from '../src/logger';

const mock = jest.mock('../src/post-pass-through', () => {
  return (
    new Promise(() => {
      return {};
    }),
    () => {
      return new Error('reject');
    }
  );
});

beforeAll(() => {
  logger.transports.forEach((elem) => {
    elem.silent = true;
  });
});
// afterAll(() => {
//   mockedRedis.mockRestore();
// });

beforeEach(() => {
  mock.resetAllMocks();
});
afterAll(() => {
  mockedRedis.mockRestore();
  mock.restoreAllMocks();
  logger.transports.forEach((elem) => {
    elem.silent = false;
  });
});
describe('basic app tests', () => {
  test('should mount', async (done) => {
    const response = await request(app).get('/middlelayer/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      version: expect.any(String),
    });
    done();
  });
});
