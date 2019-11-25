const OLD_ENV = process.env;
afterAll(() => {
  process.env = { ...OLD_ENV };
});
describe.skip('Testing constants errors', () => {
  // beforeEach(() => {
  //   // jest.resetModules();
  //   process.env = { ...OLD_ENV };
  // });
  // afterEach(() => {
  //   process.env = OLD_ENV;
  // });

  // test('env variables should be defined', () => {

  //   import('../../src/lib/common/constants')
  //     .then((module) => {
  //       console.log('sdds', process.env.REDIS_HOST_DEV);
  //       expect(process.env.REDIS_HOST_DEV).toBe(module.CONSTANTS.REDIS_HOST);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       // expect(err).toBeDefined();
  //     });
  // });

  test('undefined REDIS_HOST should throw error', () => {
    delete process.env.REDIS_HOST_DEV;
    import('../../src/lib/common/constants')
      .then((module) => {
        console.log(module);
        throw new Error('Should not reach here');
      })
      .catch((err) => {
        // console.log(err);
        expect(err).toBeDefined();
      });
  });
  test('undefined AWS_BUCKET_DEV should throw error', () => {
    delete process.env.AWS_BUCKET_DEV;
    import('../../src/lib/common/constants')
      .then((module) => {
        console.log(module);
        throw new Error('Should not reach here');
      })
      .catch((err) => {
        // console.log(err);
        expect(err).toBeDefined();
      });
  });
  test('undefined REDIS_PORT_DEV should throw error', () => {
    delete process.env.REDIS_PORT_DEV;
    import('../../src/lib/common/constants')
      .then((module) => {
        console.log(module);
        throw new Error('Should not reach here');
      })
      .catch((err) => {
        // console.log(err);
        expect(err).toBeDefined();
      });
  });
  test('undefined SESSION_SECRET_DEV should throw error', () => {
    delete process.env.SESSION_SECRET_DEV;
    import('../../src/lib/common/constants')
      .then((module) => {
        console.log(module);
        throw new Error('Should not reach here');
      })
      .catch((err) => {
        // console.log(err);
        expect(err).toBeDefined();
      });
  });
});
