/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/camelcase */
import redis from 'redis';
// eslint-disable-next-line @typescript-eslint/camelcase
import redis_mock from 'redis-mock';
import request from 'supertest';

jest.mock('winston');
const mockedRedis = jest
  .spyOn(redis, 'createClient')
  .mockImplementation(redis_mock.createClient);

import { app } from '../app';

const mock = jest.mock('../post-pass-through.ts', () => {
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
  // logger.transports.forEach((elem) => {
  //   elem.silent = true;
  // });
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
  // logger.transports.forEach((elem) => {
  //   elem.silent = false;
  // });
});
describe.skip('basic app tests', () => {
  test('should mount', async (done) => {
    const response = await request(app).get('/middlelayer/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      version: expect.any(String),
    });
    done();
  });
});
