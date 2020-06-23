# Flusshygiene Cronbot

A bot for automating tasks like in the Flusshygiene Project

- fetching data provided by users
- making predictions

It checks all bathingspots of all users for the following data urls:

- dischargesUrl
- globalIrradianceUrl
- measurementsUrl
- all genericInputs
- all purificationPlants

It expects to find http(s) URLs to fetch JSON data from in the following schema.

For measurementsUrl

```json
{"data":[{"date":"2020-06-22 10:04:39","conc_ec":920,"conc_ic":192}]}
```
For all others:

```json
{"data":[{"date":"2020-06-22 10:04:39","value":832}]}
```

You can simulate these using the cronbot-source package (A vercel.com function that returns random values e.g. for [measurementsUrl | https://cronbot-sources.now.sh/?count=1&type=conc](https://cronbot-sources.now.sh/?count=1&type=conc) for the [others | https://cronbot-sources.now.sh/?count=1](https://cronbot-sources.now.sh/?count=1&type=conc)).

It runs as an AWS ECS Fargate service on a daily schedule.

## Development

Set the following environment variables:

```bash
# auth0
AUTH0_TOKEN_ISSUER=
AUTH0_AUDIENCE=
# AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
# API_HOST=https://www.example.com
# for development using the local postgres-api package
API_HOST=http://localhost:5004
API_VERSION=v1
# flusshygiene services
FLSSHYGN_PREDICT_URL=https://www.example.com/middlelayer/predict
FLSSHYGN_CALIBRATE_URL=https://www.example.com/middlelayer/calibrate

##### NEW for SMTP

SMTP_HOST=
SMTP_USER=
SMTP_PW=
SMTP_PORT=
SMTP_FROM=
SMTP_ADMIN_TO=
```

To run a test use:

```bash
npm run dev
```


### Testing

```bash
npm test
```
