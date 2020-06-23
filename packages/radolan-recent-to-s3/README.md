# Flusshygiene radolan recent to s3

Node.js task for pulling radolan data from the DWD FTP servers and storing them on AWS S3. Part of the Flusshygiene project. Can run on a EC2 and shuts itself down when done. Needs IAM permissions for S3 and EC2.

In production it runs as a scheduled AWS Fargate task.

Sends the logs to a specific address when it is done using Mailgun.

---

## Usage

Setup:

Rename `example.env` to `.env` (`mv example.env .env`)  or create a new one (`touch .env`) and fill in your credentials for AWS and Mailgun.

```env
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_BUCKET_NAME=xxxxxx-bucket
MAILGUN_DOMAIN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.mailgun.org
MAILGUN_APIKEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_FROM=postmaster@xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.mailgun.org
MAILGUN_TO=you@foo.dev
FTP_HOST=ftp-cdc.dwd.de
FTP_PORT=21
```

The settings for the FTP_PORT and FTP_HOST can stay as is.

```bash
docker pull technologiestiftung/flusshygiene-radolan-recent
docker run --env-file $(pwd)/.env --name radolan-recent technologiestiftung/flusshygiene-radolan-recent
```

In fish-shell

```fish
docker run --env-file "$PWD/.env" --name radolan-recent technologiestiftung/flusshygiene-radolan-recent
```

## Development


Install and build:


```bash
cd path/to/folder/
npm install
npm run build
```

Run

```bash
# by setting the NODE_ENV it will log to file and not to stdout/stderr
NODE_ENV=production node dist/cli.js
```

Docker build:

```bash
docker build -t technologiestiftung/flusshygiene-radolan-recent .
```

Docker run:

```bash
run --env-file $(pwd)/.env --name radolan-recent technologiestiftung/flusshygiene-radolan-recent
```
