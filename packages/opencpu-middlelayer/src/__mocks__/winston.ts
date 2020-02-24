const logger = {
  debug: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};

// if you want this only in one file
// // jest.mock('winston', () => ({
// //   format: {
// //     colorize: jest.fn(),
// //     combine: jest.fn(),
// //     label: jest.fn(),
// //     timestamp: jest.fn(),
// //     printf: jest.fn(),
// //     metadata: jest.fn(),
// //     json: jest.fn(),
// //   },
// //   createLogger: jest.fn().mockReturnValue(logger),
// //   transports: {
// //     Console: jest.fn(),
// //     File: jest.fn(),
// //   },
// // }));

// // IMPORTANT First mock winston
module.exports = {
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
};
