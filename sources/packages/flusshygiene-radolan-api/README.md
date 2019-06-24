# Radolan API Lambda

This is a Lambda function to access all the radolan data stored in an S3 Bucket. It allows to query the bucket for download urls. You can define a date range as [URL query parameters](https://en.wikipedia.org/wiki/Query_string) with the keys `from` and `to`
The dates provided need to be in the following pattern: `YYYYMMDD`. This translates to 20190131 to set a parameter for the 31st of January in 2019.

## Prerequisites

- AWS Account
- Node.js (currently using 10.15.3)
- A Bucket with Radolan data with the following structure where the keys are `YY/MM/DD/radolan-file-name`.

```plain
05/01/01/raa01-rw_10000-0501010050-dwd---bin
05/01/01/raa01-rw_10000-0501010150-dwd---bin
05/01/01/raa01-rw_10000-0501010250-dwd---bin
05/01/01/raa01-rw_10000-0501010350-dwd---bin
05/01/01/raa01-rw_10000-0501010450-dwd---bin
05/01/01/raa01-rw_10000-0501010550-dwd---bin
05/01/01/raa01-rw_10000-0501010650-dwd---bin
05/01/01/raa01-rw_10000-0501010750-dwd---bin
(…)
19/01/01/raa01-rw_10000-1901010050-dwd---bin
```

These files ([historical](ftp://ftp-cdc.dwd.de/pub/CDC/grids_germany/hourly/radolan/historical/bin/) and [recent](ftp://ftp-cdc.dwd.de/pub/CDC/grids_germany/hourly/radolan/recent/bin/)) can be found on the FTP of the Deutsche Wetterdienst (DWD) and are scraped to a S3 bucket using these tools [technologiestiftung/flusshygiene-radolan-recent-to-s3](https://github.com/technologiestiftung/flusshygiene-radolan-recent-to-s3), [technologiestiftung/flusshygiene-radolan-historical-to-s3](https://github.com/technologiestiftung/flusshygiene-radolan-historical-to-s3) and [technologiestiftung/flusshygiene-radolan-scraper](https://github.com/technologiestiftung/flusshygiene-radolan-scrap). 

## Setup


- Follow the instructions on [serverless.com/framework/docs/providers/aws/guide/quick-start/](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) to setup your AWS account, install the CLI and run a first test.
- Change the [`example-serverless.yml`](./example-serverless.yml) to match your name, bucket name and so on and rename it to `serverless.yml`
- run `npm install`
- do a test by running `sls invoke local -f radolan --path __tests__/event_mock.json`
- If your output is fine run `sls deploy -v` (will deploy to the `dev` stage)


## Radolan Data Bucket Public Access Policy

On the Radolan bucket you need the following policy to access it publicly. 

```json
{
  "Id": "Policy1560848498952",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*",
      "Principal": {
        "AWS": [
          "*"
        ]
      }
    }
  ]
}
```

## Some useful commands while developing

Deploy a project

```bash
sls deploy
```

Deploy only a function

```bash
sls deploy -f radolan
```

Get the logs of a function

```bash
sls logs -f radolan
```

Call your function locally. `__tests__/event_mock.json` contains all the infos a event could have. See the response of a function call. 

```bash
sls invoke local -f radolan --path __tests__/event_mock.json
```

Call your function  in the cloud

```bash
sls invoke -f radolan --path __tests__/event_mock.json
```

## Production deploy

Run `sls deploy --stage prod`.

## Call Your Function

```bash
$ curl "https://xxxxxx.some-name.some-region.amazonaws.com/stage?from=20190101&to=20190103" -H 'x-api-key: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
> {
  "dates": [
    {
      "year": 19,
      "month": 1,
      "day": 1
    },
  (… all dates queried)
  ],
  "files": [
    {
      "key": "19/01/02/raa01-rw_10000-1901020050-dwd---bin",
      "url": "https://your-bucket.s3.your-region.amazonaws.com/19/01/02/raa01-rw_10000-1901020050-dwd---bin"
    },
    (… all files found)
     "input": {
       (… full event input data)
     }
}
```

### (Optional) Time Filtering

You can add a time URL parameter to filter the files be the time value coded onto the filename. If there is no match no result will be returned.  

```bash
curl "https://xxxxxx.some-name.some-region.amazonaws.com/stage?from=20190101&to=20190103&time=2250" -H 'x-api-key: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
```



## MIT License


Copyright (c) 2019 Technologiestiftung Berlin & Fabian Morón Zirfas

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