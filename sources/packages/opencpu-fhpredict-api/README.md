# Flusshygiene Opencpu fhpredict API

This is a docker setup to run an opencpu API serving the kwb-r/fhpredict package for the Flusshygiene project.  

It uses the [technologiestiftung/flusshygiene-opencpu-base](https://github.com/technologiestiftung/flusshygiene-opencpu-base) docker image as base to speedup package installation.

## Setup

Rename `example.env` to `.env` and fill in the values for your keys.[^1]

## Run locally

Execute  in your shell:

```bash
docker-compose -up
```

In another shell you can now get all users through the open cpu api

```bash
curl http://localhost:8004/ocpu/library/fhpredict/R/api_get_users/json  -H "Content-Type: application/json" -d ''
```

[^1]: More information on the setup of keys and auth will follow in a centralized repo soon(-ish).  
