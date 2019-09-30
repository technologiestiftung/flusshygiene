# flusshygiene opencpu middleware

Express layer between cms-spa and opencpu-api to get immediate feedback on POST requests. Due to the fact that there are long running processes on the fhpredict api and we dont want to run into timeouts on the frontend.
Passes some specific requests through and waits for the response. Then sends a message out over websockets. Client should listen for his ID and react accordingly.

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

