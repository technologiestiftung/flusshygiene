import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { createConnection } from 'typeorm';
import { buildPayload } from './request-handlers/responders';
// import ora from 'ora';
// import { createConnection, getRepository } from 'typeorm';
// import { Region } from '../orm/entity/Region';
// import { User } from '../orm/entity/User';
// import { createUser } from '../orm/fixtures/create-test-user';
// import { createPredictions, createSpots } from '../orm/fixtures/import-existing-data';
// import { createMeasurements } from './../orm/fixtures/import-existing-data';
// import { DefaultRegions, IAddEntitiesToSpotOptions, UserRole } from './types-interfaces';
// import { addEntitiesToSpot } from './utils/bathingspot-helpers';

const app = express();
// const spinner = ora('populating database');
// const infoSpinner = (text: string, spin: ora.Ora) => {

//   if (spin.isSpinning) {
//     spin.succeed();
//   }
//   spin.start();
//   spin.text = text;
// };
createConnection();
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
} else {
  app.use(helmet());
  app.use(morgan('combined'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  const data = ['',
'    _________________________',
'    < Flusshygiene yeah baby! >',
'     -------------------------',
'            \\   ^__^',
'             \\  (oo)\_______',
'                (__)\\       )\\/\\',
'                    ||----w |',
'                    ||     ||',
''];
  response.json(buildPayload(true, `Server is running. You called ${request.url}`,data));
});

// app.use('/api/v1', async (err: Error, _req: Request, res: Response, next: NextFunction)=>{
//   const con = await getConnection();
//   if(con === undefined){
//     responder(res, HttpCodes.internalError, errorResponse(err));
//   }else{
//     next(err);
//   }
// });
app.use('/api/v1', routes);
// app.use('/api/v1', router);
if (process.env.NODE_ENV === 'development') {
  // In Express an error handler,
  // always has to be the last line before starting the server.
  app.use(errorHandler());
}

export = app;
