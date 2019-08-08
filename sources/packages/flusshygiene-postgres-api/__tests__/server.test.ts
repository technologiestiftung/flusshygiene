import express from 'express';
import path from 'path';
jest.useFakeTimers();

const app = express();
const mockListen = jest.fn();
app.listen = mockListen;
afterEach(() => {
  mockListen.mockReset();
});
describe.skip('testing if the server is running', () => {
  test('server defaults', async () => {
    require('../src/lib/server');
    // tslint:disable-next-line:no-console
    console.log(mockListen.mock.calls[0][0]);
    expect(mockListen.mock.calls.length).toBe(1);
    expect(mockListen.mock.calls[0][0]).toBe(
      process.env.FRONTEND_REDIS_PORT || 6004,
    );
  });
});
