# Flusshygiene CMS SPA

[![Greenkeeper badge](https://badges.greenkeeper.io/technologiestiftung/flusshygiene-cms-spa.svg)](https://greenkeeper.io/) ![Build Status](https://github.com/technologiestiftung/flusshygiene-cms-spa/workflows/Node%20CI%20Build/badge.svg) ![Build Status](https://github.com/technologiestiftung/flusshygiene-cms-spa/workflows/docker-image-build-and-push/badge.svg) ![Build Status](https://github.com/technologiestiftung/flusshygiene-cms-spa/workflows/Node%20CI%20Test/badge.svg) [![Build Status](https://travis-ci.com/technologiestiftung/flusshygiene-cms-spa.svg?branch=master)](https://travis-ci.com/technologiestiftung/flusshygiene-cms-spa) ![Docker Build Status](https://img.shields.io/docker/cloud/build/technologiestiftung/flusshygiene-cms-spa)

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                      | last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                                               |

**But!:** See [The perils of using Internet Explorer as your default browser](https://techcommunity.microsoft.com/t5/Windows-IT-Pro-Blog/The-perils-of-using-Internet-Explorer-as-your-default-browser/ba-p/331732) and [Stop using Internet Explorer immediately; also, why are you still using Internet Explorer?](https://mashable.com/article/internet-explorer-vulnerability-just-stop-using-it/?europe=true) and [Lifecycle FAQ—Internet Explorer and Edge](https://support.microsoft.com/en-us/help/17454/lifecycle-faq-internet-explorer).

So supporting IE has no priority for this project and we will drop support without notice if it creates blocking problems.

## Support

We are part of BrowserStack's non-profit program, helping us deliver an even better user experience.

<a href="https://www.browserstack.com/">
  <img src="../../docs/images/browserstack-logo-600x315.png" height="100">
</a>

---

A Single Page Application (SPA) for interacting with the [technologiestiftung/flusshygiene-postgres-api](https://github.com/technologiestiftung/flusshygiene-postgres-api). Part of the Flusshygiene project.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

- Node.js
- Auth0 Account

## Development

Set the following environment variables:

```bash
PORT=3000
REACT_APP_MAPBOX_API_TOKEN=
REACT_APP_AUTH0_DOMAIN=
REACT_APP_AUTH0_CLIENTID=
REACT_APP_AUTH0_AUDIENCE=
REACT_APP_DOMAIN_URL=https://www.example.com
REACT_APP_DOMAIN_NICE_NAME=www.example.com
REACT_APP_API_HOST=
REACT_APP_EVENT_SOURCE_URL=/middlelayer/stream
REACT_APP_ADMIN_MAIL=foo@example.com
```

Run the following processes in their respective order (for the postgres-api package you will have to set its environment variable. See its README.md).

```bash
# session 1
# start the react frontend
cd packages/cms-spa/
npm start

# session 2
# start the postgres and redis db
cd packages/postgres-api
docker-compose up
#session 3
# if populate is set to the db will be pre populated
cd packages/postgres-api/
POPULATE=true NODE_ENV=development npm run dev
```

### `npm test`

Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
