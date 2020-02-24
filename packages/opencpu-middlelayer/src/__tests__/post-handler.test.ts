import { postHandler } from './../request-handler/post-handler';
import { buildRes, buildReq } from './utils/factories';
import broadcaster from '../broadcaster-instance';
import postPassThrough from '../post-pass-through';
import { VERSION } from '../common/constants';
// post - handler.test.ts;
jest.mock(
  '../broadcaster-instance',
  () => {
    const mockBroadcaster = {
      emit: jest.fn(),
      getInstance: jest.fn(() => {
        console.log('called getInstance');
        return mockBroadcaster;
      }),
      instance: jest.fn(() => {
        console.log('called instance');

        return mockBroadcaster;
      }),
    };
    return mockBroadcaster;
  },
  {},
);

jest.mock('../post-pass-through');
// beforeAll(() => {
//   mod.postPassThrough = jest.fn();
// });
jest.mock('winston');
beforeEach(() => {
  jest.resetAllMocks();
});
describe('postHandler', () => {
  test('default postHandler', async (done) => {
    const res = buildRes();
    const req = buildReq();

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    await postHandler(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(broadcaster.emit).toHaveBeenCalledTimes(1);
    const body = {};
    await expect(postPassThrough('/', body)).resolves.toEqual(body);
    done();
  });

  test('pass through call', async () => {
    jest.unmock('../post-pass-through');
    const res = buildRes();
    let req = buildReq({ url: '/sleep', sessionID: 1 });
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    await postHandler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: `Your request to ${req.url} is beeing processed`,
      version: VERSION,
      sessionID: req.sessionID,
    });

    req = buildReq({ url: '/model', sessionID: 2 });
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    await postHandler(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: `Your request to ${req.url} is beeing processed`,
      version: VERSION,
      sessionID: req.sessionID,
    });

    req = buildReq({ url: '/predict', sessionID: 3 });
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    await postHandler(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: `Your request to ${req.url} is beeing processed`,
      version: VERSION,
      sessionID: req.sessionID,
    });
    req = buildReq({ url: '/calibrate', sessionID: 4 });
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    await postHandler(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: `Your request to ${req.url} is beeing processed`,
      version: VERSION,
      sessionID: req.sessionID,
    });
  });
});
