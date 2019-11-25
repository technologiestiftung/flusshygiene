import * as winston from 'winston';

import mkdirp from 'mkdirp';
import path from 'path';

mkdirp.sync(path.resolve(process.cwd(), './logs/'));
const logger = winston.createLogger({
  exitOnError: false,
  level: 'info',
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: path.resolve(process.cwd(), './logs/postgres-api-all.log'),
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
