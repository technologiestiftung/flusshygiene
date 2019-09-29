import { SESSION_SECRET } from './common/constants';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { logStream } from './logger';
import morgan from 'morgan';
import { router } from './http-router';
import session from 'express-session';

const app = express();
app.use(
  session({
    secret:
      SESSION_SECRET !== undefined
        ? SESSION_SECRET
        : '45364f84-f39c-449d-b997-27f20da7e8ec',
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
} else if (process.env.NODE_ENV === 'test') {
} else {
  app.use(helmet());
  app.use(morgan('combined', { stream: logStream }));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/', router);
export default app;
