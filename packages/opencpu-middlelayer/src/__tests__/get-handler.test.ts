import { buildReq, buildRes } from './utils/factories';
import { getHandler } from '../request-handler/get-handler';
import { VERSION } from '../common/constants';
beforeEach(() => {
  jest.resetAllMocks();
});
describe('get handlers', () => {
  test('should response with json', async (done) => {
    const req = buildReq();
    const res = buildRes();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    await getHandler(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Everything OK',
      version: VERSION,
    });
    done();
  });
});
