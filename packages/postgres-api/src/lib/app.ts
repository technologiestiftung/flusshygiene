import cors, { CorsOptions } from 'cors';
// import errorHandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import routes from './routes';
import { CONSTANTS } from './common/constants';
import redis from 'redis';
import session from 'express-session';
import uuidv4 from 'uuid/v4';
import { cookieListing } from './middleware/cookie-listing';
import { logger } from './logger';
import publicRoutes from './routes-public';
import { errorHandler } from './middleware/errorHandler';

const RedisStore = require('connect-redis')(session);
const client = redis.createClient({
  host: CONSTANTS.REDIS_HOST,
  port: CONSTANTS.REDIS_PORT,
});
client.on('error', console.error);
client.on('connect', () => {
  logger.info('redis client has connected');
});

client.on('end', () => {
  logger.info('redis client session has disconnected');
});
const app = express();

try {
  createConnection()
    .then((_con) => {
      if (process.env.NODE_ENV === 'development') {
        process.stdout.write('connection established\n');
      }
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
} catch (error) {
  console.error(error);
}

const whitelist = [
  'https://www.flusshygiene.xyz',
  'http://localhost:3000',
  'http://localhost:8888',
];
const corsOptions: CorsOptions = {
  origin: function(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
if (process.env.NODE_ENV === 'development') {
  app.options('*', cors());
  app.use(morgan('combined'));
} else {
  app.use(helmet());
  app.use(morgan('combined'));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/v1/public', publicRoutes);
app.use(
  session({
    genid: function(_req: any) {
      return uuidv4(); // use UUIDs for session IDs
    },
    store: new RedisStore({ client }),
    secret:
      CONSTANTS.SESSION_SECRET !== undefined
        ? CONSTANTS.SESSION_SECRET
        : '45364f84-f39c-449d-b997-27f20da7e8ec',
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(cookieListing);
app.use('/api/v1', routes);

// if (process.env.NODE_ENV === 'development') {
// In Express an error handler,
// always has to be the last line before starting the server.
// app.use(errorHandler());
app.use(errorHandler);
// } else {
// }

export = app;
