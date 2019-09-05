import meow from 'meow';
import ora = require('ora');
import readlineSync from 'readline-sync';
import { createConnection, getConnectionOptions, getRepository } from 'typeorm';
import { DefaultRegions, UserRole } from '../lib/common';
import { Region } from '../orm/entity/Region';
import { User } from '../orm/entity/User';
import { Bathingspot } from './../orm/entity/Bathingspot';
import {
  addEntitiesToSpot,
  IAddEntitiesToSpotOptions,
} from './add-entities-to-spot';
import { createUser } from './create-test-user';
import {
  createMeasurements,
  createPredictions,
  createSpots,
  createSpotsDE /*<--- include this*/,
} from './import-existing-data';
const spinner = ora('populating database');
const infoSpinner = (text: string, spin: ora.Ora) => {
  if (spin.isSpinning) {
    spin.succeed();
  }
  spin.start();
  spin.text = text;
};

// const path = require('path');
// const readlineSync = require('readline-sync');
const cli = meow(
  `

╦ ╦┌─┐┌─┐┌─┐┌─┐
║ ║└─┐├─┤│ ┬├┤
╚═╝└─┘┴ ┴└─┘└─┘

pass the path for the config you want to use.

`,
  {
    flags: {
      yes: {
        alias: 'y',
        default: false,
        type: 'boolean',
      },
    },
  },
);
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
    if (cli.flags.yes === false) {
      const resp = readlineSync.question(
        'Do you want to use these values? (only yes will continue): ',
      );
      if (resp !== 'yes') {
        process.exit();
      }
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
    userCreator.firstName = 'Flusshygiene';
    userCreator.lastName = '';
    userCreator.role = UserRole.creator;
    userCreator.email = 'flusshygiene@protonmail.com';
    userCreator.auth0Id = process.env.DEFAULT_AUTH0ID || '';
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

    const spotsDE =
      process.env.FAST === undefined ? await createSpotsDE() : undefined; // <--- include this
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

    spots.forEach((s) => {
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
    const arr: Bathingspot[] = [];
    if (process.env.FAST === undefined) {
      userCreator.bathingspots = arr.concat(spots, spotsDE!); // <--- include this
    } else {
      userCreator.bathingspots = arr.concat(spots /*, spotsDE */); // <--- include this
    }

    // spinner.succeed();
    // spinner.start();
    infoSpinner('Saving regions', spinner);

    await connection.manager.save(regions);
    // await connection.manager.save(spot);
    // spinner.succeed();
    // spinner.start();
    infoSpinner('Saving spots', spinner);

    await connection.manager.save(spots);
    if (process.env.FAST === undefined) {
      await connection.manager.save(spotsDE);
    }

    infoSpinner('Saving spots DE', spinner);

    infoSpinner('Saving spots DE BathingspotMeasurement', spinner);

    infoSpinner('Saving users', spinner);

    await connection.manager.save([userCreator, userReporter]);
    // now update all the spots with createMeasurements

    infoSpinner('Importing BathingspotMeasurement', spinner);

    const measurements = await createMeasurements();
    // const spotRepo = getCustomRepository(BathingspotRepository);
    const opts: IAddEntitiesToSpotOptions = {
      connection,
      entities: measurements,
    };

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

    spinner.succeed();
    spinner.stop();
    spinner.succeed('Done');

    if (databaseEmpty === true && process.env.NODE_ENV === 'production') {
      // uh oh we are in production
      console.error('in production with empty DB?');
    }
  } catch (gobalError) {
    console.error(gobalError.message);
    throw gobalError;
  }
  // console.log('Done with setup');
})();
