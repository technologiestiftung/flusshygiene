import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import {createConnection, getRepository} from 'typeorm';
import { Region } from '../orm/entity/Region';
import { User } from '../orm/entity/User';
import { createProtectedUser } from '../orm/fixtures/create-protected-user';
import { Bathingspot } from './../orm/entity/Bathingspot';
import routes from './routes';
import { Regions, UserRole } from './types-interfaces';

const app = express();
// let connection: Connection;
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(helmet());
  app.use(morgan('tiny'));
}
app.use(express.json());
app.use(express.urlencoded({extended: true}));

(async () => {
  try {
    const connection = await createConnection();
    // const db = await connection.connect();
    // process.stdout.write(db.name);
    let databaseEmpty: boolean = true;
    const users = await getRepository(User).find();
    process.stdout.write(`${users.length}\n`);
    if (users.length !== 0) {
      databaseEmpty = false;
    }

    // process.stdout.write(`Users ${JSON.stringify(users)}\n`);
    if (databaseEmpty === true && process.env.NODE_ENV === 'development') {
      // the first user we create is a special user
      // it is protected and cannot be deletet through the API easily
      // it is for stashing data of deleted users
      // because what should we do when we have to delete a user but maintain the bathingspots?
      await connection.manager.save(createProtectedUser());

      // generate some default data here
      const user = new User();
      user.firstName = 'James';
      user.lastName = 'Bond';
      user.role = UserRole.creator;
      user.email = 'faker@fake.com';
      const spot = new Bathingspot();
      const region = new Region();
      region.name = Regions.berlinbrandenburg;
      spot.region = region;
      spot.isPublic = true;
      spot.name = 'billabong';
      user.bathingspots = [spot];
      await connection.manager.save(region);
      await connection.manager.save(spot);
      await connection.manager.save(user);

    }
    if (databaseEmpty === true && process.env.NODE_ENV === 'production') {
      // uh oh we are in production
      const protectedUser = await getRepository(User).find({where: {
        protected: true,
      }});
      if (protectedUser === undefined) {
        // uh oh no protected user,
      await connection.manager.save(createProtectedUser());

      }

    }
  } catch (error) {
    throw error;
  }
})();

app.get('/', (request, response) => {
  response.send(`Server is running. You called ${request.url}`);
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
