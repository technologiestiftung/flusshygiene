// logger.test.ts;
import { logger, logStream } from '../src/logger';
const spyLogger = jest.spyOn(logger, 'info');
describe('testing logger', () => {
  test('logStream should call logger.info', () => {
    logStream.write('foo');
    expect(spyLogger).toHaveBeenCalled();
  });
});
