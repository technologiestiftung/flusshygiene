import { REDIS_HOST, REDIS_PORT, SESSION_SECRET } from './common/constants';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { logStream, logger } from './logger';
import morgan from 'morgan';
import redis from 'redis';
import { router } from './http-router';
import session from 'express-session';
import uuidv4 from 'uuid/v4';
import { timeoutMiddleware, sleepFuncCheck } from './middleware';
import expressWs from 'express-ws';

const RedisStore = require('connect-redis')(session);
const client = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });
client.on('error', console.error);
client.on('connect', () => {
  logger.info('redis client has connected');
});

client.on('end', () => {
  logger.info('redis client session has disconnected');
});

const eapp = express();
const wsInstance = expressWs(eapp);
const { app } = wsInstance;
const wss = wsInstance.getWss();
// const ewss = expressWs(app);
// const wss = expressWs.getWss();
app.use(
  session({
    genid: function(_req) {
      return uuidv4(); // use UUIDs for session IDs
    },
    store: new RedisStore({ client }),
    secret:
      SESSION_SECRET !== undefined
        ? SESSION_SECRET
        : '45364f84-f39c-449d-b997-27f20da7e8ec',
    resave: false,
    saveUninitialized: true,
  }),
);
const origins = [process.env.APP_HOST_1!, process.env.APP_HOST_2!];
if (process.env.NODE_ENV === 'development') {
  origins.push('http://localhost');
}
app.use(
  cors({
    origin: origins,
  }),
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
} else if (process.env.NODE_ENV === 'test') {
} else {
  app.use(helmet());
  app.use(morgan('combined', { stream: logStream }));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(timeoutMiddleware);
app.use('/middlelayer', sleepFuncCheck, router);

app.ws('/middlelayer/socket', (ws, _req) => {
  // console.log(req.sessionID);
  // logger.info('req loc', req);
  ws.on('message', (data) => {
    // console.log(data);
    logger.info(`Message over ws ${data}`, data);
    // wss.clients.forEach((client: any) => {
    //   client.send(data);
    // });
  });
});

export { app, wss };
