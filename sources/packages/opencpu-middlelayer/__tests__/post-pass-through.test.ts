import { logger } from '../src/logger';
import nock from 'nock';
import { postPassThrough } from '../src/post-pass-through';

const scope = nock('http://localhost:65535')
  .post('/')
  .reply(201, {});
// jest.useFakeTimers();
// import http from 'http';
// const server = http.createServer((req, res) => {
//   res.writeHead(201, { 'Content-Type': 'text/plain' });
//   res.end('okay');
// });
// server.listen(65535);

// afterAll(() => {
//   server.close();
// });

describe('post pass through tests', () => {
  test('should return empty body', async (done) => {
    const res = await postPassThrough('http://localhost:65535', {});
    expect(res).toEqual({});
    done();
  });
  test('should error due to missing server', async (done) => {
    const mockLoggerErr = jest
      .spyOn(logger, 'error')
      .mockImplementation((o: object) => {
        return logger;
      });
    const res = await postPassThrough('http://localhost:6553', {});
    expect(res).toBeInstanceOf(Error);
    expect(mockLoggerErr).toHaveBeenCalled();
    mockLoggerErr.mockRestore();

    done();
  });
  test('should log error due to NODE_ENV development', async (done) => {
    process.env.NODE_ENV = 'development';
    const mockLoggerErr = jest
      .spyOn(logger, 'error')
      .mockImplementation((o: object) => {
        return logger;
      });
    const mockConsoleErr = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const res = await postPassThrough('http://localhost:6553', {});
    expect(res).toBeInstanceOf(Error);
    expect(mockConsoleErr).toHaveBeenCalled();
    expect(mockLoggerErr).not.toHaveBeenCalled();

    mockLoggerErr.mockRestore();
    process.env.NODE_ENV = 'test';

    done();
  });
});
