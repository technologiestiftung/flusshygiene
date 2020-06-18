FROM node:12.18.1-alpine as builder
LABEL maintainer="Fabian Morón Zirfas"
LABEL description="An API for a the helpdesk to send mails"
ENV NODE_ENV=development
WORKDIR /usr/app
COPY ./package*.json ./
RUN npm ci --quiet --no-optional && npm cache clean --force
COPY ./ ./
RUN npm run build
FROM node:12.18.1-alpine as app
# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
WORKDIR /home/node
COPY ./package*.json ./
RUN npm ci --quiet --no-optional && npm cache clean --force
COPY --from=builder /usr/app/dist /home/node/dist
USER node
EXPOSE 6004
ENTRYPOINT [ "node" ]
CMD ["dist/index.js"]