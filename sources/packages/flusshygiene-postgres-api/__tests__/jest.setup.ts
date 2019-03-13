// import { BathingspotRawModelData } from '../src/orm/entity/BathingspotRawModelData';
// import { BathingspotPrediction } from '../src/orm/entity/BathingspotPrediction';
// import { BathingspotModel } from '../src/orm/entity/BathingspotModel';
// import { Bathingspot } from '../src/orm/entity/Bathingspot';
// import { createConnection, Connection } from 'typeorm';
// import { User } from '../src/orm/entity/User';
// import { Questionaire } from '../src/orm/entity/Questionaire';
// import { UserRole, Regions } from '../src/lib/types-interfaces';
// import { Region } from '../src/orm/entity/Region';
// let thatconnection: Connection;

module.exports = async () => {
//   try {
//     thatconnection = await createConnection({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'postgres',
//       password: 'postgres_password',
//       database: 'postgres',
//       synchronize: true,
//       logging: false,
//       dropSchema: true,
//       entities: [
//         User,
//         Region,
//         Questionaire,
//         Bathingspot,
//         BathingspotModel,
//         BathingspotPrediction,
//         BathingspotRawModelData
//       ],
//     });

//     // const db = await connection.connect();
//     // process.stdout.write(db.name);
//     let databaseEmpty = true;

//     const users = await thatconnection.getRepository(User).find();
//     process.stdout.write(`There are no users ${users.length}\n`);
//     if (users.length !== 0) {
//       databaseEmpty = false;
//     }
//     // process.stdout.write(`Users ${JSON.stringify(users)}\n`);
//     if (databaseEmpty === true && process.env.NODE_ENV === 'test') {
//       // gneerate some default data here
//       let user = new User();
//       user.firstName = 'James';
//       user.lastName = 'Bond';
//       user.role = UserRole.creator;
//       user.email = 'faker@fake.com';
//       const spot = new Bathingspot();
//       const region = new Region();
//       region.name = Regions.berlinbrandenburg;
//       spot.region = region;
//       spot.isPublic = true;
//       spot.name = 'billabong';
//       user.bathingspots = [spot];
//       await thatconnection.manager.save(region);
//       await thatconnection.manager.save(spot);
//       await thatconnection.manager.save(user);
//     }
//     console.log('done with beforeAll setup');
//   } catch (error) {
//     throw error;
//   }
  console.log('Setup jest for all tests');
}
