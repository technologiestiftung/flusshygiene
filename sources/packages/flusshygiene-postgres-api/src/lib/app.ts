import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import {createConnection, getRepository} from 'typeorm';
import { User } from '../orm/entity/User';
import { UserRole } from './types-interfaces';

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
(async ()=>{
  try{
    const connection = await createConnection();
    // const db = await connection.connect();
    // process.stdout.write(db.name);
    let databaseEmpty:boolean = true;
    const users = await getRepository(User).find();
    process.stdout.write(`${users.length}\n`);
    if(users.length !== 0){
      databaseEmpty = false;
    }
    // process.stdout.write(`Users ${JSON.stringify(users)}\n`);
    if (databaseEmpty === true && process.env.NODE_ENV === 'development'){
      // gneerate some default data here
      let user = new User();
      user.firstName = 'James';
      user.lastName = 'Bond';
      user.role = UserRole.creator;
      user.email = 'faker@fake.com';
      await connection.manager.save(user);
    }
  }catch(error){
    throw error;
  }

})();

export = app;
