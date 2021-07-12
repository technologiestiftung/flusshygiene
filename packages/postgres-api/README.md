# Flusshygiene Postgres API

[![Build Status](https://travis-ci.org/technologiestiftung/flusshygiene-postgres-api.svg?branch=master)](https://travis-ci.org/technologiestiftung/flusshygiene-postgres-api) [![Greenkeeper badge](https://badges.greenkeeper.io/technologiestiftung/flusshygiene-postgres-api.svg)](https://greenkeeper.io/) [![Maintainability](https://api.codeclimate.com/v1/badges/a0d196f19ac975156593/maintainability)](https://codeclimate.com/github/technologiestiftung/flusshygiene-postgres-api/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/a0d196f19ac975156593/test_coverage)](https://codeclimate.com/github/technologiestiftung/flusshygiene-postgres-api/test_coverage) [![Known Vulnerabilities](https://snyk.io/test/github/technologiestiftung/flusshygiene-postgres-api/badge.svg)](https://snyk.io/test/github/technologiestiftung/flusshygiene-postgres-api)

A express REST api to interact with the postgres database for the flusshygiene project. Uses TypeORM

## Development

needs a running Postgres db for testing and for development.

Run:

```bash
cd packages/postgres-api
docker-compose up
```

Needs also a a lot of `.env` variables:

```bash
# NODE_ENV=development
# set to 0 if you are running on your machine
# 1 means in a container
NODE_DOCKER_ENV=1
# postgres
PG_USER_DEV=postgres
PG_USER_PROD=XXXXXXXXXXX

PG_HOST_DEV=127.0.0.1
PG_HOST_PROD=somthing.xxxxxxxxxxx.region.rds.amazonaws.com
# Docker specific values host needs NODE_DOCKER_ENV=1
PG_HOST_DEV_DOCKER=postgres

# database name
PG_DATABASE_DEV=postgres
PG_DATABASE_PROD=xxxxxxxxxxxxxx
# database password
PG_PASSWORD_DEV=postgres_password
PG_PASSWORD_PROD=xxxxxxxxxxxxxxxxxxxx

# database port
PG_PORT_DEV=5432
PG_PORT_PROD=5432

# port for the express server postgres-api
POSTGRES_EXPRESS_PORT_DEV=5004
POSTGRES_EXPRESS_PORT_PROD=5004


# auth0 realted values
# you will need to create an API and an application that can access it on auth0
JWKS_URI=https://you.eu.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=your-audience
AUTH0_ISSUER=https://you.eu.auth0.com/

```

Then run

```bash
cd packages/postgres-api
POPULATE=true NODE_ENV=development npm run dev
```

### Testing

```bash
npm test
```


----

build with docker:

```bash
docker build username/containername:tag
```

run with docker:

```bash
docker run --name shortname --env-file ./path/to/.env -p=5004:5004 username/containername:tag

```

## DB

### Migrations

See the [typeorm migration guide](https://typeorm.io/#/migrations) for further explanation. In short:

```bash

# generate latest state
npm run build
NODE_DOCKER_ENV=0 NODE_ENV=production npm run typeorm migration:generate -- --name NewMigrationFile
# generate js from ts
npm run build
NODE_DOCKER_ENV=0 NODE_ENV=production npm run typeorm migration:run
NODE_DOCKER_ENV=0 NODE_ENV=production npm run typeorm migration:revert
```
