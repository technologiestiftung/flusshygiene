# `@tsb/cronbot-sources`

This is a testing api for the cronbot package. Needs a [vercel.com/now](https://vercel.com/) account and now cli installed `npm install -g now@latest`.

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

### Testing

```bashh
npm test
```

## Deploy

```bash
now
# or
now --prod
```
