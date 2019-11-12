# Flusshygiene OpenCPU Base Image

This is the base image containing all dependencies for the [flusshygiene-opencpu-api](https://github.com/technologiestiftung/flusshygiene-opencpu-fhpredict-api) which uses the [kwb-r/fhpredict](https://github.com/kwb-r/fhpredict) R package for creating predictions used in the Flusshygiene project. It can be found here on [hub.docker.com](https://hub.docker.com/r/technologiestiftung/flusshygiene-opencpu-base).  

## Notes

- The image takes a long time to build. Make sure your system has at least 4 GB Memory available.
- Uses [github/actions](https://github.com/features/actions) to build in the cloud. Make sure you have the following secrets set:
  - DOCKER_USER
  - DOCKER_PASSWORD

## Setup

Rename `example.env` to `.env` and fill in all the values. 

## Usage

**!Note:** `$` indicates the command `>` the result in code blocks. Where no response is shown the `$` is omitted.  

For a full usage of the opencpu api visit [www.opencpu.org/api.html](https://www.opencpu.org/api.html).  

For local build and run do a `docker-compose up` in the root of the repo.

To test if everything worked fine run:

```bash
curl "http://localhost:8004/ocpu/info"
```

or visit [localhost:8004/ocpu/test/](http://localhost:8004/ocpu/test/) and make some requests.

You can use same of the included packages by running commands like these:

```bash
curl "http://localhost:8004/ocpu/library/stats/R/rnorm" -d "n=10&mean=5"
```

Which will respond with:

```bash
$ curl "http://localhost:8004/ocpu/library/stats/R/rnorm" -d "n=10&mean=5" 
> /ocpu/tmp/x0fb93b3a614e02/R/.val
> /ocpu/tmp/x0fb93b3a614e02/R/rnorm
> /ocpu/tmp/x0fb93b3a614e02/stdout
> /ocpu/tmp/x0fb93b3a614e02/source
> /ocpu/tmp/x0fb93b3a614e02/console
> /ocpu/tmp/x0fb93b3a614e02/info
> /ocpu/tmp/x0fb93b3a614e02/files/DESCRIPTION
```

Now call the following commands to see the result:

```bash
$ curl "http://localhost:8004/ocpu/tmp/x0fb93b3a614e02/R/.val/print"
> [1] 3.516998 6.021151 5.031592 5.938907 5.584654 4.188811 4.224427 5.126916
> [9] 4.980865 4.708501
```

## License

MIT
