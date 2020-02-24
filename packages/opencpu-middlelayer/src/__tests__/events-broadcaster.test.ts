// IMPORTANT First mock winston
jest.mock('winston');

import { BroadCaster } from '../events-broadcaster';
import { buildReq, buildRes } from './utils/factories';
const origProcess = process;

beforeAll(() => {});
beforeEach(() => {
  jest.resetAllMocks();
});
afterAll(() => {
  process = origProcess;
});
describe('events broadcasting', () => {
  test('default class instance test', () => {
    const instanceOne = BroadCaster.getInstance();
    const instanceTwo = BroadCaster.getInstance();
    expect(instanceOne).toBe(instanceTwo);
  });

  test(' broadcaster route', () => {
    const req = buildReq({
      on: jest.fn(),
      httpVersion: '1.0',
      socket: {
        setTimeout: jest.fn(),
        setNoDelay: jest.fn(),
        setKeepAlive: jest.fn(),
      },
    });
    const res = buildRes({
      setHeader: jest.fn(),
      write: jest.fn(),
    });
    const instance = BroadCaster.getInstance();

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    instance.route(req, res);
    expect(res.statusCode).toBe(200);
    expect(req.socket.setTimeout).toHaveBeenCalledTimes(1);
    expect(req.socket.setTimeout).toHaveBeenCalledWith(0);
    expect(req.socket.setNoDelay).toHaveBeenCalledTimes(1);
    expect(req.socket.setNoDelay).toHaveBeenCalledWith(true);
    expect(req.socket.setKeepAlive).toHaveReturnedTimes(1);
    expect(req.socket.setKeepAlive).toHaveBeenCalledWith(true);
    expect(res.setHeader).toHaveBeenCalledTimes(3);
    expect(res.setHeader).toHaveBeenNthCalledWith(
      1,
      'Content-Type',
      'text/event-stream',
    );
    expect(res.setHeader).toHaveBeenNthCalledWith(
      2,
      'Cache-Control',
      'no-cache',
    );
    expect(res.setHeader).toHaveBeenNthCalledWith(
      3,

      'Connection',
      'keep-alive',
    );
  });

  test('data handler call', () => {
    const req = buildReq({
      on: jest.fn(),
      httpVersion: '1.0',
      socket: {
        setTimeout: jest.fn(),
        setNoDelay: jest.fn(),
        setKeepAlive: jest.fn(),
      },
    });
    const res = buildRes({
      setHeader: jest.fn(),
      write: jest.fn(),
    });
    const instance = BroadCaster.getInstance();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    instance.route(req, res);
    instance.emit('data', { id: 1 });
    expect(res.write).toHaveBeenCalledTimes(3);
  });
});
