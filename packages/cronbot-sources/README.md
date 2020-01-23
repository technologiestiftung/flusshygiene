# `@tsb/cronbot-sources`

This is a testing api for the cronbot package. Needs a [Zeit.co/now](https://zeit.co/home) account and now cli installed `npm install -g now@latest`.

## Usage

You can connect to it using https.

```bash
curl "https://cronbot-sources.now.sh?count=10"
# or
curl "https://cronbot-sources.now.sh?count=10&type=conc"
```

## Development

```bash
now dev
```

## Deploy

```bash
now
# or
now --prod
```
