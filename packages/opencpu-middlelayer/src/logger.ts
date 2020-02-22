import * as winston from 'winston';

import mkdirp from 'mkdirp';
import path from 'path';
const logFormat = winston.format.printf(
  (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
);

mkdirp.sync(path.resolve(process.cwd(), './logs/'));
const logger = winston.createLogger({
  exitOnError: false,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.label({
      label: path.basename(
        process.mainModule ? process.mainModule.filename : 'logger',
      ),
    }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Format the metadata object
    winston.format.metadata({
      fillExcept: ['message', 'level', 'timestamp', 'label'],
    }),
  ),
  transports: [
    new winston.transports.Console({
      // level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    new winston.transports.File({
      filename: path.resolve(
        process.cwd(),
        './logs/opencpu-middlelayer-all.log',
      ),
      format: winston.format.combine(
        // Render in one line in your log file.
        // If you use prettyPrint() here it will be really
        // difficult to exploit your logs files afterwards.
        winston.format.json(),
      ),
      handleExceptions: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
    }),
  ],
});

const logStream = {
  write: (text: string): void => {
    logger.info(text);
  },
};

export default logger;
export { logStream, logger };
