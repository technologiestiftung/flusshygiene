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
SMTP_HOST=
SMTP_USER=
SMTP_PW=
SMTP_PORT=
SMTP_FROM=
SMTP_ADMIN_TO=
DWD_HTTP_HOST=https://opendata.dwd.de/climate_environment/CDC/grids_germany/daily/radolan/recent/bin/
```


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

## License

MIT License

Copyright (c) 2019 - 2021 Technologiestiftung Berlin & Fabian Morón Zirfas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
