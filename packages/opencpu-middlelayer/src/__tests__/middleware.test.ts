import { timeoutMiddleware, sleepFuncCheck } from '../middleware';
import { buildRes, buildReq, buildNext } from './utils/factories';
beforeEach(() => {
  jest.resetAllMocks();
});
describe('middleware function test', () => {
  test('timeoutMiddleware', () => {
    const res = buildRes();
    const req = buildReq();
    const next = buildNext();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    timeoutMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.setTimeout).toHaveBeenCalled();
    expect(req.setTimeout).toHaveBeenCalled();
  });
  test('sleepFuncCheck', () => {
    const res = buildRes();
    const req = buildReq();
    const next = buildNext();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    sleepFuncCheck(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });
  test('sleepFuncCheck in production', () => {
    const origProcessEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const res = buildRes();
    const req = buildReq({ url: '/sleep' });
    const next = buildNext();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    sleepFuncCheck(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
    process.env.NODE_ENV = origProcessEnv;
  });
});
