// import { ENV_SUFFIX } from '../src/common/constants';

// constants.test.ts;

describe('testing constants', () => {
  test('should return constants under production', async (done) => {
    const curEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    import('../src/common/constants').then((module) => {
      expect(module.ENV_SUFFIX).toBe('PROD');
      process.env.NODE_ENV = curEnv;
      done();
    });
  });
});
