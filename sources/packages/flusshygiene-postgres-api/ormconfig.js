let nodeDevInDocker = false;

if (process.env.NODE_DOCKER_ENV === '1') {
  nodeDevInDocker = true;
  process.stdout.write('we are running in a container\n');
} else if (process.env.NODE_DOCKER_ENV === '0') {
  process.stdout.write('we are running on your machine\n');
  nodeDevInDocker = false;
} else {
  process.stdout.write('"process.env.NODE_DOCKER_ENV" is not defined What is your env?\n');
}

module.exports = {
  cli: {
    entitiesDir: 'src/orm/entity',
    migrationsDir: 'src/orm/migration',
    subscribersDir: 'src/orm/subscriber',
  },
  database: 'postgres',
  dropSchema: true,
  entities: [
    'dist/orm/entity/**/*.js',
  ],
  host: nodeDevInDocker === true ? process.env.PG_HOST : '127.0.0.1',
  logging: false,
  migrations: [
    'dist/orm/migration/**/*.js',
  ],
  password: 'postgres_password',
  port: 5432,
  subscribers: [
    'dist/orm/subscriber/**/*.js',
  ],
  synchronize: true,
  type: 'postgres',
  username: 'postgres',
};
