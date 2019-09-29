import app from '../src/app';
import request from 'supertest';

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
beforeEach(() => {
  mock.resetAllMocks();
});
afterAll(() => {
  mock.restoreAllMocks();
});
describe('basic app tests', () => {
  test('should mount', async (done) => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.text).toMatchSnapshot();
    done();
  });
});
