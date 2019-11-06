// logger.test.ts;
import { logStream, logger } from '../src/logger';
const spyLogger = jest.spyOn(logger, 'info').mockImplementation(() => {
  return logger;
});
describe('testing logger', () => {
  test('logStream should call logger.info', () => {
    logStream.write('foo');
    expect(spyLogger).toHaveBeenCalled();
    spyLogger.mockRestore();
  });
});
