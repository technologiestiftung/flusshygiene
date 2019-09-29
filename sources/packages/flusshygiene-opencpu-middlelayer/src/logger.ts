import * as winston from 'winston';

const logger = winston.createLogger({
  exitOnError: false,
  level: 'info',
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: 'logs/pubsub-all.log',
      handleExceptions: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
    }),
  ],
});

const logStream = {
  write: (text: string) => {
    logger.info(text);
  },
};

export { logStream, logger };
