require('dotenv').config();
const {version} = require('./package.json');
// let nodeDevInDocker = false;
// console.log('in ormconfig.js');
const NODE_ENV = process.env.NODE_ENV;
console.log(NODE_ENV, version);

const ENV_SUFFIX = NODE_ENV === 'production' ? 'PROD' : 'DEV';
let PG_HOST = '';

if(NODE_ENV !== 'development' && NODE_ENV !== 'production'){
  process.stderr.write(`NODE_ENV is neither "DEV" nor "PROD" aborting spinup\n`);
  process.exit(1);
}

if (process.env.NODE_DOCKER_ENV === '1') {
  process.stdout.write('we are running in a container\n');
  if(NODE_ENV === 'development'){
    PG_HOST = process.env.PG_HOST_DEV_DOCKER;
  }else if(NODE_ENV === 'production'){
    PG_HOST = process.env.PG_HOST_PROD;
  }

} else if (process.env.NODE_DOCKER_ENV === '0') {
  process.stdout.write('we are running on your machine\n');
  if(NODE_ENV === 'development'){
    PG_HOST = process.env.PG_HOST_DEV;
  }else if(NODE_ENV ==='production'){
    PG_HOST = process.env.PG_HOST_PROD;
  }

} else {
  process.stderr.write('"process.env.NODE_DOCKER_ENV" is not defined What is your env? Aborting spinup\n');
  process.exit(1);
}

const opts = {
  name: 'default',
  cli: {
    entitiesDir: 'src/orm/entity',
    migrationsDir: 'src/orm/migration',
    subscribersDir: 'src/orm/subscriber',
  },
  database: process.env[`PG_DATABASE_${ENV_SUFFIX}`],
  dropSchema: NODE_ENV === 'production' ? false : false,
  entities: [
    'dist/orm/entity/**/*.js',
  ],
  host: PG_HOST,
  logging: false,
  migrations: [
    'dist/orm/migration/**/*.js',
  ],
  password: process.env[`PG_PASSWORD_${ENV_SUFFIX}`],
  port: process.env[`PG_PORT_${ENV_SUFFIX}`],
  subscribers: [
    'dist/orm/subscriber/**/*.js',
  ],
  synchronize: NODE_ENV === 'production' ? false : false,
  type: 'postgres',
  username: process.env[`PG_USER_${ENV_SUFFIX}`],
};

if(NODE_ENV === 'test' || NODE_ENV === 'development'){
  console.log('in ormconfig.js');
  console.log(opts);
}
module.exports = opts;
