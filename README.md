![](https://img.shields.io/badge/Build%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiesitftung%20Berlin-blue)

# Flusshygiene

This is the the source for the web application of the project Flusshygiene.  

## CI Status

[![Docker Image Builder Workflow badge](https://github.com/technologiestiftung/flusshygiene/workflows/Docker%20Image%20Builder/badge.svg)](https://github.com/technologiestiftung/flusshygiene/actions?query=workflow%3A%22Docker+Image+Builder%22) [![FHPREDICT Test Workflow badge](https://github.com/technologiestiftung/flusshygiene/workflows/FHPREDICT%20API%20test%20and%20build/badge.svg)](https://github.com/technologiestiftung/flusshygiene/actions?query=workflow%3A%22FHPREDICT+API+test+and+build%22)  [![MIDDLELAYER Test Workflow badge](https://github.com/technologiestiftung/flusshygiene/workflows/MIDDLELAYER%20test%20and%20build/badge.svg)](https://github.com/technologiestiftung/flusshygiene/actions?query=workflow%3A%22MIDDLELAYER+test+and+build%22) [![NGINX Test Workflow badge](https://github.com/technologiestiftung/flusshygiene/workflows/NGINX%20test%20and%20build/badge.svg)](https://github.com/technologiestiftung/flusshygiene/actions?query=workflow%3A%22NGINX+test+and+build%22) [![OPENCPU BASE Test Workflow badge](https://github.com/technologiestiftung/flusshygiene/workflows/OPENCPU%20BASE%20test%20and%20build/badge.svg)](https://github.com/technologiestiftung/flusshygiene/actions?query=workflow%3A%22OPENCPU+BASE+test+and+build%22) [![POSTGRES API Test Workflow badge](https://github.com/technologiestiftung/flusshygiene/workflows/POSTGRES%20API%20test%20and%20build/badge.svg)](https://github.com/technologiestiftung/flusshygiene/actions?query=workflow%3A%22POSTGRES+API+test+and+build%22) [![CMS SPA Test Workflow badge](https://github.com/technologiestiftung/flusshygiene/workflows/CMS%20SPA%20test%20and%20build/badge.svg)](https://github.com/technologiestiftung/flusshygiene/actions?query=workflow%3A%22CMS+SPA+test+and+build%22) [![Coverage Status](https://coveralls.io/repos/github/technologiestiftung/flusshygiene/badge.svg?branch=master)](https://coveralls.io/github/technologiestiftung/flusshygiene?branch=master)

<!-- https://github.com/<OWNER>/<REPOSITORY>/workflows/<WORKFLOW_FILE_PATH>/badge.svg -->

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Flusshygiene](#flusshygiene)
  - [CI Status](#ci-status)
  - [Prerequisites](#prerequisites)
    - [blackbox](#blackbox)
    - [auth0.com](#auth0com)
    - [AWS](#aws)
    - [Docker](#docker)
  - [Folder `terraform`](#folder-terraform)
    - [Setup Terraform](#setup-terraform)
    - [Deploy With Terraform](#deploy-with-terraform)
    - [Setup Postgres/Postgis RDS Database](#setup-postgrespostgis-rds-database)
  - [Folder `packages`](#folder-packages)
  - [Folder `elastic-beanstalk-deply`](#folder-elastic-beanstalk-deply)
    - [Setup EB](#setup-eb)
    - [Deploy EB](#deploy-eb)
  - [Contributors](#contributors)

<!-- /code_chunk_output -->

## Prerequisites

- auth0.com account
  - api configured
  - extension configured to api
- aws account
  - aws credentials
  - eb cli installed
  - aws cli?
- docker account
  - docker installed
- terraform installed
- serverless installed
- blackbox installed (optional)


### blackbox

encrypt decrypt secrets

### auth0.com

- add domain(s) from aws to allowed domains in api

### AWS

### Docker

## Folder `terraform`


### Setup Terraform

- install terraform
- aws credentials
- fill in variables

### Deploy With Terraform

Order of deployment:

1. s3-pgapi-uploads
2. s3-radolan-recent
3. rds
4. elastic-cache
5. ecs-radolan-recent
6. cloud-watch
7. elastic-beanstalk
8. ecs-fargate-cronbot

after `cd elastic-beanstalk && terraform apply` you will have to create a ssh key, download it, `chmod 600` it and store it in `~/.ssh` for usage with the eb cli and for provisioning the DB

### Setup Postgres/Postgis RDS Database

- create key for ec2 instance

```bash
cd terraform/ec2-worker-with-nodejs
terraform init
terraform plan
terraform apply
ssh -i path/to/your/YOUR.pem   ubuntu@SOME.DOMAIN.eu-central-1.compute.amazonaws.com
# on the remote worker
# you can use tmux to attach/detach a session
# https://en.wikipedia.org/wiki/Tmux
cd pgapi
npm run build && NODE_DOCKER_ENV=0 NODE_ENV=production FAST=true npm run populatedb
```

## Folder `packages`

- lerna

## Folder `elastic-beanstalk-deply`

### Setup EB

- Install `eb-cli`
- setup your env 
  - credentials?
  - `eb init --profile flsshygn`
  - `eb status` to see what is going on
  - `eb use {ENV}`
  - `eb ssh --setup` to create ssh keys for your ec2 instances

### Deploy EB

- deploy `eb deploy --profile flsshygn`

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://fabianmoronzirfas.me/"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="https://github.com/technologiestiftung/flusshygiene/commits?author=ff6347" title="Code">💻</a> <a href="https://github.com/technologiestiftung/flusshygiene/commits?author=ff6347" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/hsonne"><img src="https://avatars.githubusercontent.com/u/11964315?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Hauke Sonnenberg</b></sub></a><br /><a href="https://github.com/technologiestiftung/flusshygiene/commits?author=hsonne" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/vogelino"><img src="https://avatars.githubusercontent.com/u/2759340?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Lucas Vogel</b></sub></a><br /><a href="https://github.com/technologiestiftung/flusshygiene/commits?author=vogelino" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/wseis"><img src="https://avatars.githubusercontent.com/u/31789484?v=4?s=64" width="64px;" alt=""/><br /><sub><b>wseis</b></sub></a><br /><a href="#data-wseis" title="Data">🔣</a> <a href="https://github.com/technologiestiftung/flusshygiene/pulls?q=is%3Apr+reviewed-by%3Awseis" title="Reviewed Pull Requests">👀</a> <a href="#design-wseis" title="Design">🎨</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Credits

### Partners network
<table>
  <tr>
    <td>
      <a src="https://www.berlin.de/lageso/">
        <img width="150" src="https://logos.citylab-berlin.org/logo-lageso.svg" />
      </a>
    </td>
    <td>
      <a src="https://www.bwb.de/de/index.php">
        <img width="120" src="https://logos.citylab-berlin.org/logo-berliner-wasserbetriebe.svg" />
      </a>
    </td>
    <td>
      <a src="https://www.kompetenz-wasser.de/en">
        <img width="120" src="https://logos.citylab-berlin.org/logo-kwb.svg" />
      </a>
    </td>
    <td>
      <a src="https://www.technologiestiftung-berlin.de/en/">
        <img width="120" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-en.svg" />
      </a>
    </td>
  </tr>
</table>

### Developed in the project
<table>
  <tr>
    <td>
      <a src="https://www.kompetenz-wasser.de/en">
        <img width="150" src="https://logos.citylab-berlin.org/logo-flusshygiene.png" />
      </a>
    </td>
</table>

### Supported by
<table>
  <tr>
    <td>
      <a src="https://www.bmbf.de/bmbf/en/home/home_node.html">
        <img width="120" src="https://logos.citylab-berlin.org/logo-bbf.svg" />
      </a>
    </td>
    <td>
      <a src="https://bmbf.nawam-rewam.de/en/">
        <img width="160" src="https://logos.citylab-berlin.org/logo-nawam.jpg" />
      </a>
    </td>
  </tr>
</table>
