import { UserRole } from './common';
// import { GenericInput } from './../orm/entity/GenericInput';
// import { PurificationPlant } from './../orm/entity/PurificationPlant';
import { Bathingspot } from './../orm/entity/Bathingspot';
import cors, { CorsOptions } from 'cors';
// import errorHandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { createConnection, getConnectionOptions } from 'typeorm';
import routes from './routes';
import { CONSTANTS } from './common/constants';
import redis from 'redis';
import session from 'express-session';
import uuidv4 from 'uuid/v4';
import { cookieListing } from './middleware/cookie-listing';
import { logger } from './logger';
import routesPublic from './routes-public';
import { errorHandler } from './middleware/errorHandler';
import { User, PurificationPlant, GenericInput } from '../orm/entity';

const RedisStore = require('connect-redis')(session); // eslint-disable-line
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

(async () => {
  try {
    if (
      process.env.POPULATE !== undefined &&
      process.env.NODE_ENV === 'development'
    ) {
      const connectionOptions = await getConnectionOptions();
      Object.assign(connectionOptions, {
        synchronize: true,
        dropSchema: true,
      });
      process.stdout.write('sync schema established\n');
      const connection = await createConnection(connectionOptions);
      const manager = connection.createEntityManager();
      const user = new User();
      user.email = process.env.DIFFERENT_EMAIL
        ? process.env.DIFFERENT_EMAIL
        : 'foo@bah.com';
      user.firstName = 'foo';
      user.lastName = 'bah';
      user.auth0Id = process.env.DEFAULT_AUTH0ID || '';
      user.role = UserRole.creator;
      await manager.save(user);

      const spot = new Bathingspot();
      spot.isPublic = true;
      spot.name = 'foo';
      spot.apiEndpoints = {
        measurementsUrl: 'https://cronbot-sources.now.sh/?count=10&type=conc',
        dischargesUrl:
          'https://raw.githubusercontent.com/KWB-R/flusshygiene/gh-pages/q_tw.json',
        globalIrradianceUrl: 'https://cronbot-sources.now.sh/?count=10',
      };
      await manager.save(spot);
      user.bathingspots = [spot];
      await manager.save(user);

      // const model = new BathingspotModel();
      // model.parameter = ModelParamter.conc_ec;
      // await manager.save(model);
      // const modelFile = new RModelFile();
      // modelFile.type = 'rmodel';
      // modelFile.url = 'foo';
      // await manager.save(RModelFile);
      // model.rmodelfiles = [modelFile];
      // await manager.save(model);
      // spot.models = [model];
      // await manager.save(spot);

      const spotErr = new Bathingspot();
      spotErr.isPublic = true;
      spotErr.name = 'error';
      spotErr.apiEndpoints = {
        measurementsUrl:
          'https://cronbot-sources.now.sh/?count=10&type&err=true',
        dischargesUrl:
          'https://raw.githubusercontent.com/KWB-R/flusshygiene/gh-pages/q_tw.json',
        globalIrradianceUrl: 'cronbot-sources.now.sh/?count=10&type&err=true',
      };
      await manager.save(spotErr);
      user.bathingspots.push(spotErr);
      await manager.save(user);
      const errPPlant = manager.create(PurificationPlant, [
        {
          name: 'error1',
          url: 'http://doesnotexist',
        },
        {
          name: 'error2',
          url: 'https://cronbot-sources.now.sh/?count=10&type&err=true',
        },
        {
          name: 'error3',
          url: 'https://cronbot-sources.now.sh/?count=100',
        },
      ]);
      await manager.save(errPPlant);
      spotErr.purificationPlants = errPPlant;
      await manager.save(spotErr);
      // const plant = new PurificationPlant();
      const pplants = manager.create(PurificationPlant, [
        {
          name: 'plant1',

          url: 'https://cronbot-sources.now.sh/?count=10',
        },
        {
          name: 'plant2',

          url: 'https://cronbot-sources.now.sh/?count=10',
        },
      ]);
      // plant.name = 'plant';
      // plant.url = 'https://cronbot-sources.now.sh/?count=100';
      await manager.save(pplants);
      spot.purificationPlants = pplants;
      await manager.save(spot);
      // const gi = new GenericInput();
      // gi.name = 'gi';
      // gi.url = 'https://cronbot-sources.now.sh/?count=10';

      // await manager.save(gi);
      const gis = manager.create(GenericInput, [
        {
          name: 'gi1',
          url: 'https://cronbot-sources.now.sh/?count=100',
        },
        {
          name: 'gi2',
          url: 'https://cronbot-sources.now.sh/?count=100',
        },
      ]);
      // console.log(gis);
      await manager.save(gis);
      spot.genericInputs = gis;
      await manager.save(spot);

      // crate userIDErrorResponse
      // create spot
      // crate pplant
      // create gi
      // create
      process.stdout.write('connection established\n');
    } else if (process.env.NODE_ENV === 'development') {
      await createConnection();
      process.stdout.write('connection established\n');
    } else {
      await createConnection();
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
})();

const whitelist = [
  'https://www.flusshygiene.xyz',
  'https://www.flussbaden.org',
  'https://flussbaden.org',
];
if (process.env.NODE_ENV === 'development') {
  const locals = [
    'http://localhost:3000',
    'http://localhost:8888',
    'http://localhost:5004',
  ];
  whitelist.push(...locals);
}
const corsOptions: CorsOptions = {
  origin: function(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(origin, 'Not allowed by CORS');
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// app.use(limiter);
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

app.use('/api/v1/public', routesPublic);

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
