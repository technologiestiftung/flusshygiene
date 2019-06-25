# Flusshygiene Postgres API

[![Build Status](https://travis-ci.org/technologiestiftung/flusshygiene-postgres-api.svg?branch=master)](https://travis-ci.org/technologiestiftung/flusshygiene-postgres-api) [![Greenkeeper badge](https://badges.greenkeeper.io/technologiestiftung/flusshygiene-postgres-api.svg)](https://greenkeeper.io/) [![Maintainability](https://api.codeclimate.com/v1/badges/a0d196f19ac975156593/maintainability)](https://codeclimate.com/github/technologiestiftung/flusshygiene-postgres-api/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/a0d196f19ac975156593/test_coverage)](https://codeclimate.com/github/technologiestiftung/flusshygiene-postgres-api/test_coverage) [![Known Vulnerabilities](https://snyk.io/test/github/technologiestiftung/flusshygiene-postgres-api/badge.svg)](https://snyk.io/test/github/technologiestiftung/flusshygiene-postgres-api)

needs a running postgres db for testing and for development.

Run:

```bash
docker run -p 5432:5432 mdillon/postgis:10
```

Needs also a a lot of `.env` variables:

```bash
# NODE_ENV=development
NODE_DOCKER_ENV=1
# postgres
PG_USER_DEV=postgres
PG_USER_PROD=XXXXXXXXXXX

PG_HOST_DEV=127.0.0.1
PG_HOST_PROD=somthing.xxxxxxxxxxx.region.rds.amazonaws.com

PG_DATABASE_DEV=postgres
PG_DATABASE_PROD=xxxxxxxxxxxxxx

PG_PASSWORD_DEV=postgres_password
PG_PASSWORD_PROD=xxxxxxxxxxxxxxxxxxxx

PG_PORT_DEV=5432
PG_PORT_PROD=5432

# postgres api
POSTGRES_EXPRESS_PORT_DEV=5004
POSTGRES_EXPRESS_PORT_PROD=5004

# Docker specific values
PG_HOST_DEV_DOCKER=postgres

# auth0
JWKS_URI=https://you.eu.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=your-audience
AUTH0_ISSUER=https://you.eu.auth0.com/

```

build with

```bash
docker build username/containername:tag
```

run

docker run --name shortname -p=5004:5004 username/containername:tag

more infos coming soon(-ish).

<!-- trigger travis again -->
