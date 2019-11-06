# flusshygiene opencpu middleware

[![Coverage Status](https://coveralls.io/repos/github/technologiestiftung/flusshygiene-opencpu-middlelayer/badge.svg?branch=master)](https://coveralls.io/github/technologiestiftung/flusshygiene-opencpu-middlelayer?branch=master) [![Build Status](https://travis-ci.org/technologiestiftung/flusshygiene-opencpu-middlelayer.svg?branch=master)](https://travis-ci.org/technologiestiftung/flusshygiene-opencpu-middlelayer) ![Build Status](https://github.com/technologiestiftung/flusshygiene-opencpu-middlelayer/workflows/Docker%20Image%20Build%20Test/badge.svg) ![Build Status](https://github.com/technologiestiftung/flusshygiene-opencpu-middlelayer/workflows/Build%20and%20Push%20Docker%20Image/badge.svg) ![Build Status](https://github.com/technologiestiftung/flusshygiene-opencpu-middlelayer/workflows/Jest%20Tests/badge.svg) ![Build Status](https://github.com/technologiestiftung/flusshygiene-opencpu-middlelayer/workflows/Typescript%20Build/badge.svg)

Express layer between cms-spa and opencpu-fhpredict-api to get immediate feedback on POST requests. Due to the fact that there are long running processes on the fhpredict api and we don't want to run into timeouts on the frontend.
Passes some specific requests through and waits for the response. Then sends a message out over websocket. Client should listen for his ID and react accordingly.

## Usage

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/fabianmoronzirfas/flusshygiene-redis-pubsub/issues)

## Author

**Fabian Morón Zirfas @technologiestiftung**

* [github/](https://github.com/fabianmoronzirfas)
* [twitter/](http://twitter.com/fmoronzirfas)

## License

Copyright © 2019 Technologiestiftung Berlin & Fabian Morón Zirfas
Licensed under the MIT license.

