# Flusshygiene


This is the the source for the web application of the project Flusshygiene.  

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Flusshygiene](#flusshygiene)
  - [Prerequisites](#prerequisites)
    - [blackbox](#blackbox)
    - [auth0.com](#auth0com)
    - [AWS](#aws)
    - [Docker](#docker)
  - [Folder `terraform`](#folder-terraform)
    - [Setup](#setup)
    - [Deploy](#deploy)
    - [Setup Postgres/Postgis RDS Database](#setup-postgrespostgis-rds-database)
  - [Folder `sources`](#folder-sources)
  - [Folder `elastic-beanstalk-deply`](#folder-elastic-beanstalk-deply)
    - [Setup](#setup-1)
    - [Deploy](#deploy-1)

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


### Setup

- install terraform
- aws credentials
- fill in variables

### Deploy

Order of deployment:

1. s3-pgapi-uploads
2. s3-radolan-recent
3. rds
4. elastic-cache
5. ecs-radolan-recent
6. elastic-beanstalk

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

## Folder `sources`

- lerna


## Folder `elastic-beanstalk-deply`

### Setup

- Install `eb-cli`
- setup your env 
  - credentials?
  - `eb init --profile flsshygn`
  - `eb status` to see what is going on
  - `eb use {ENV}`
  - `eb ssh --setup` to create ssh keys for your ec2 instances

### Deploy

- deploy `eb deploy --profile flsshygn`

