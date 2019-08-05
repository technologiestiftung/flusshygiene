import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { createConnection } from 'typeorm';
import { buildPayload } from './request-handlers/responders';

const app = express();

createConnection();
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
} else {
  app.use(helmet());
  app.use(morgan('combined'));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (request, response) => {
  const data = [
    '',
    '    _________________________',
    '    < Flusshygiene yeah baby! >',
    '     -------------------------',
    '            \\   ^__^',
    '             \\  (oo)_______',
    '                (__)\\       )\\/\\',
    '                    ||----w |',
    '                    ||     ||',
    '',
  ];
  response.json(
    buildPayload(true, `Server is running. You called ${request.url}`, data),
  );
});

app.use('/api/v1', routes);
if (process.env.NODE_ENV === 'development') {
  // In Express an error handler,
  // always has to be the last line before starting the server.
  app.use(errorHandler());
}

export = app;
