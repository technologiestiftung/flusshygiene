# Production Dockerfile
FROM node:12.18.4-alpine as builder

LABEL maintainer="Fabian Morón Zirfas"
LABEL description="a cronbot for the flusshygiene project that does jobs every day"

ENV NODE_ENV=development
WORKDIR /usr/app
COPY ./package*.json ./
RUN npm ci --quiet
COPY ./ ./
RUN npm run build
FROM node:12.18.4-alpine as app
WORKDIR  /home/node
ENV NODE_ENV=production
# all of the below need to be set on the env
#ENV AUTH0_TOKEN_ISSUER
#ENV AUTH0_AUDIENCE
#ENV AUTH0_DOMAIN
#ENV AUTH0_CLIENT_ID
#ENV AUTH0_CLIENT_SECRETqFwU
#ENV API_HOST
#ENV API_VERSION
#ENV MAILGUN_DOMAIN
#ENV MAILGUN_APIKEY
#ENV MAILGUN_FROM
#ENV MAILGUN_TO
#ENV FLSSHYGN_PREDICT_URL
#ENV FLSSHYGN_CALIBRATE_URL


COPY ./package*.json ./
RUN npm ci --quiet
COPY --from=builder /usr/app/dist /home/node/dist

USER node
RUN touch db.json
EXPOSE 5004
ENTRYPOINT [ "node", "./dist/cli.js" ]
CMD ["--adminonly", "--predict", "--verbose"]
