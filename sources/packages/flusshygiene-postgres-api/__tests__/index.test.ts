
// import request from 'supertest';
import http from 'http';

import app from '../src/lib/app';
jest.useFakeTimers();

const mockListen = jest.fn();
http.createServer(app).listen = mockListen;
// app.listen = mockListen;
afterEach(() => {
  mockListen.mockReset();
});
describe.skip('testing if the server is running', () => {
  test('server defaults', async () => {
    require('../src/index');
    // tslint:disable-next-line:no-console
    // console.log(mockListen.mock.calls[0][1]);
    expect(mockListen.mock.calls.length).toBe(1);
    expect(mockListen.mock.calls[0][0]).toBe(process.env.REDIS_EXPRESS_PORT || 6004);
  });
});
