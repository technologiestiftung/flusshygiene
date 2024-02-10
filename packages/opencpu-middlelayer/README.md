# flusshygiene opencpu middleware

[![Build Status](https://travis-ci.org/technologiestiftung/flusshygiene-opencpu-middlelayer.svg?branch=master)](https://travis-ci.org/technologiestiftung/flusshygiene-opencpu-middlelayer) ![Build Status](https://github.com/technologiestiftung/flusshygiene-opencpu-middlelayer/workflows/Docker%20Image%20Build%20Test/badge.svg) ![Build Status](https://github.com/technologiestiftung/flusshygiene-opencpu-middlelayer/workflows/Build%20and%20Push%20Docker%20Image/badge.svg) ![Build Status](https://github.com/technologiestiftung/flusshygiene-opencpu-middlelayer/workflows/Jest%20Tests/badge.svg) ![Build Status](https://github.com/technologiestiftung/flusshygiene-opencpu-middlelayer/workflows/Typescript%20Build/badge.svg)

Express layer between cms-spa and opencpu-fhpredict-api to get immediate feedback on POST requests. Due to the fact that there are long running processes on the fhpredict api and we don't want to run into timeouts on the frontend.
Passes some specific requests through and waits for the response. Then sends a message out over websocket. Client should listen for his ID and react accordingly.

## Development

Should be developed in integration with postgres-api and cms-spa packages (you will need to setup all their environment variables. Rename `example.env` to `.env` and fill in the blanks).


```bash

# session 1
# the redis and postgres db
cd packages/postgres-api
docker-compose up

# session 2
# the api
cd packages/postgres-api
POPULATE=true NODE_ENV=development npm run dev

# session 3
cd packages/opencpu-middlelayer
npm run dev

# session 4
cd packages/cms-spa/
npm start
```

## Testing

```sh
npm test
```
