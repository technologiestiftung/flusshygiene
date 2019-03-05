import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';

const app = express();

app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(helmet());
  app.use(morgan('tiny'));
}
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', (request, response) => {
    response.send(`Server is running. You called ${request.url}`);
  });
app.use('/api/v1', routes);
// app.use('/api/v1', router);
if (process.env.NODE_ENV === 'development') {
  // In Express an error handler,
  // always has to be the last line before starting the server.
  app.use(errorHandler());
}
export = app;
