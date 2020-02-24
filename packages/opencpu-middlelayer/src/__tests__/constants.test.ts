// import { ENV_SUFFIX } from '../src/common/constants';

// constants.test.ts;

describe('testing constants', () => {
  test('should return constants under production', async (done) => {
    const curEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    import('../common/constants').then((module) => {
      expect(module.ENV_SUFFIX).toBe('PROD');
      expect(typeof module.REDIS_PORT).toBe('number');
      expect(module.REDIS_PORT).toBe(6379);
      process.env.NODE_ENV = curEnv;
      done();
    });
  });
});
