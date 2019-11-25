import express, { Application } from 'express';
import { cookieListing } from '../../src/lib/middleware/cookie-listing';
import { logger } from '../../src/lib/logger';
import request from 'supertest';

const spyLogger = jest.spyOn(logger, 'info').mockImplementation(() => {
  return logger;
});

afterAll(() => {
  spyLogger.mockRestore();
});
describe('Testing cookie listing dev tool middleware functions', () => {
  let app: Application;

  app = express();
  app.use(cookieListing);
  app.get('/', (req, res) => {
    res.json({});
  });
  test('should log to the console', async (done) => {
    const nodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(spyLogger).toHaveBeenCalled();
    spyLogger.mockReset();
    done();
    process.env.NOqDE_ENV = nodeEnv;
  });

  test('should log to the console', async (done) => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(spyLogger).not.toHaveBeenCalled();
    done();
  });
});
