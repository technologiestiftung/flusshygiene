const logger = {
  debug: jest.fn(),
  log: jest.fn(),
};

// IMPORTANT First mock winston
jest.mock('winston', () => ({
  format: {
    colorize: jest.fn(),
    combine: jest.fn(),
    label: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    metadata: jest.fn(),
    json: jest.fn(),
  },
  createLogger: jest.fn().mockReturnValue(logger),
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));
// IMPORTANT import the mock after
// import * as winston from 'winston';
// jest.mock('../logger');
import { BroadCaster } from '../events-broadcaster';
const origProcess = process;

beforeAll(() => {});
beforeEach(() => {
  jest.resetAllMocks();
});
afterAll(() => {
  process = origProcess;
});
describe('events broadcasting', () => {
  test('default class instance test', () => {
    const instanceOne = BroadCaster.getInstance();
    const instanceTwo = BroadCaster.getInstance();
    expect(instanceOne).toBe(instanceTwo);
  });
});
