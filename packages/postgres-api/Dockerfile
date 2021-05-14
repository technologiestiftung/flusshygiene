# Production Dockerfile
FROM node:12.22.1-alpine as builder

LABEL maintainer="Fabian Morón Zirfas"
LABEL description="An API for a postgres/postgis db used in the project flusshygiene"

ENV NODE_ENV=development
WORKDIR /usr/app
COPY ./package*.json ./
RUN npm ci --quiet
COPY ./ ./
RUN npm run build
FROM node:12.22.1-alpine as app
WORKDIR  /home/node
ENV NODE_ENV=production
ENV NODE_DOCKER_ENV=1
COPY ./package*.json ./
COPY ./ormconfig.js ./
RUN npm ci --quiet
COPY --from=builder /usr/app/dist /home/node/dist

USER node
EXPOSE 5004
CMD ["node", "--max_old_space_size=2048", "dist/index.js"]
