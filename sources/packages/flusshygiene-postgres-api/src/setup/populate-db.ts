import ora = require('ora');
import { createConnection, getRepository, getConnectionOptions } from 'typeorm';
import { DefaultRegions, IAddEntitiesToSpotOptions, UserRole } from '../lib/common';
import { addEntitiesToSpot } from '../lib/utils/bathingspot-helpers';
import { Region } from '../orm/entity/Region';
import { User } from '../orm/entity/User';
import { createUser } from './create-test-user';
import { createMeasurements, createPredictions, createSpots } from './import-existing-data';
import readlineSync from 'readline-sync';

const spinner = ora('populating database');
const infoSpinner = (text: string, spin: ora.Ora) => {

  if (spin.isSpinning) {
    spin.succeed();
  }
  spin.start();
  spin.text = text;
};

// const meow = require('meow');
// const path = require('path');
// const readlineSync = require('readline-sync');
// const cli = meow(`

// ╦ ╦┌─┐┌─┐┌─┐┌─┐
// ║ ║└─┐├─┤│ ┬├┤
// ╚═╝└─┘┴ ┴└─┘└─┘

// pass the path for the config you want to use.

// `);
// if(cli.input.length === 0){
//   cli.showHelp();
// }
// const result = require('dotenv').config(path.resolve(process.cwd(), cli.input[0]));
// if(result instanceof Error){
//   throw result;
// }
// console.log(result.parsed);
// var resp = readlineSync.question('Do you want to use these values? (only yes will continue): ');
// if(resp !== 'yes'){
//   process.exit();
// }

(async () => {
  try {
    // for populating the DB we need to override the values in the config
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, { synchronize: true, dropSchema: true });
    console.log('I will use these options:');
    console.log(connectionOptions);
    const resp = readlineSync.question('Do you want to use these values? (only yes will continue): ');
    if (resp !== 'yes') {
      process.exit();
    }
    const connection = await createConnection(connectionOptions);
    // const db = await connection.connect();
    // process.stdout.write(db.name);
    let databaseEmpty: boolean = false;
    let users;
    try {
      users = await getRepository(User).find();
      process.stdout.write(`${JSON.stringify(users)}\n`);
    } catch (error) {
      process.stdout.write(`Users don't exist. \n`);

      databaseEmpty = true;
    }

    // process.stdout.write(`Users ${JSON.stringify(users)}\n`);
    // const spinner = ora('populating database');
    // the first user we create is a special user
    // it is protected and cannot be deletet through the API easily
    // it is for stashing data of deleted users
    // because what should we do when we have to delete a user but maintain the bathingspots?
    // spinner.start();
    // infoSpinner('Creating default admin user', spinner);
    infoSpinner('Creating default admin user', spinner);
    await connection.manager.save(createUser());
    // spinner.succeed();
    // spinner.start();
    infoSpinner('Creating default creator user', spinner);

    const userCreator = new User();
    userCreator.firstName = 'James';
    userCreator.lastName = 'Bond';
    userCreator.role = UserRole.creator;
    userCreator.email = 'faker@fake.com';
    // spinner.succeed();
    // spinner.start();
    infoSpinner('Creating default reporter user', spinner);

    const userReporter = new User();
    userReporter.firstName = 'Karla';
    userReporter.lastName = 'Kolumna';
    userReporter.role = UserRole.reporter;
    userReporter.email = 'karla@bluemchen.dev';
    // spinner.succeed();
    // spinner.start();
    infoSpinner('Importing existing Bathingspots', spinner);
    const spots = await createSpots();
    // const spot = new Bathingspot();
    const regions: Region[] = [];

    // spinner.succeed();
    // spinner.start();
    infoSpinner('Creating default regions', spinner);

    for (const key in DefaultRegions) {
      if (DefaultRegions.hasOwnProperty(key)) {
        const r = new Region();
        r.name = key;
        r.displayName = key;
        regions.push(r);
      }
    }
    // const region = new Region();
    // region.name = Regions.berlinbrandenburg;
    // spinner.succeed();
    // spinner.start();
    infoSpinner('assigning spots to region', spinner);

    spots.forEach(s => {
      s.region = regions[1];
    });
    // spot.region = regions[0];
    // spot.isPublic = true;
    // spot.name = 'billabong';
    // spinner.succeed();
    // spinner.start();
    infoSpinner('Adding spots to default creator user', spinner);

    userCreator.regions = [regions[0], regions[1]];
    userReporter.regions = [regions[0]];
    userCreator.bathingspots = [...spots];
    // spinner.succeed();
    // spinner.start();
    infoSpinner('Saving regions', spinner);

    await connection.manager.save(regions);
    // await connection.manager.save(spot);
    // spinner.succeed();
    // spinner.start();
    infoSpinner('Saving spots', spinner);

    await connection.manager.save(spots);

    // spinner.succeed();
    // spinner.start();
    infoSpinner('Saving users', spinner);

    await connection.manager.save([userCreator, userReporter]);
    // now update all the spots with createMeasurements
    // spinner.succeed();
    // spinner.start();
    infoSpinner('Importing BathingspotMeasurement', spinner);

    const measurements = await createMeasurements();
    // const spotRepo = getCustomRepository(BathingspotRepository);
    const opts: IAddEntitiesToSpotOptions = {
      connection,
      entities: measurements,
    };

    // spinner.succeed();
    // spinner.start();
    infoSpinner('Adding BathingspotMeasurement to Bathingspots', spinner);

    await addEntitiesToSpot(opts);

    // spinner.succeed();
    // spinner.start();
    infoSpinner('Importing BathingspotPredictions', spinner);

    const predictions = await createPredictions();

    // spinner.succeed();
    // spinner.start();
    infoSpinner('Adding BathingspotPredictions to Bathingspots', spinner);
    opts.entities = predictions;
    await addEntitiesToSpot(opts);

    // for (const p of predictions) {
    //   await connection.manager.save(p);

    //   const bspot = await spotRepo.findOne({
    //     where: {
    //       oldId: p.oldId,
    //     },
    //   });
    //   if (bspot !== undefined) {
    //     if (bspot.predictions === undefined) {
    //       bspot.predictions = [p];
    //     } else {
    //       bspot.predictions.push(p);
    //     }
    //     await connection.manager.save(bspot);
    //   }
    // }

    spinner.succeed();
    spinner.stop();
    spinner.succeed('Done');

    if (databaseEmpty === true && process.env.NODE_ENV === 'production') {
      // uh oh we are in production
      console.error('in production with empty DB?');
      // const protectedUser = await getRepository(User).find({
      //   where: {
      //     protected: true,
      //   },
      // });
      // if (protectedUser === undefined) {
      //   // uh oh no protected user,
      //   const newProtectedUser = createUser();
      //   if (newProtectedUser !== undefined) {

      //     await connection.manager.save(newProtectedUser);
      //   } else {
      //     throw new Error('could not create protected user');
      //   }
      // }
    }
  } catch (gobalError) {
    console.error(gobalError.message);
    throw gobalError;
  }
  // console.log('Done with setup');
})();