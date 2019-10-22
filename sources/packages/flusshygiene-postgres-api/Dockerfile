# Production Dockerfile
FROM node:10.16.3-alpine as builder

LABEL maintainer="Fabian Morón Zirfas"
LABEL description="An API for a postgres/postgis db used in the project flusshygiene"

ENV NODE_ENV=development
WORKDIR /usr/app
COPY ./package*.json ./
RUN npm ci --quiet
COPY ./ ./
RUN npm run build
FROM node:10.16.3-alpine as app
WORKDIR  /usr/app
ENV NODE_ENV=production
ENV NODE_DOCKER_ENV=1
COPY ./package*.json ./
COPY ./ormconfig.js ./
RUN npm ci --quiet
COPY --from=builder /usr/app/dist /usr/app/dist
USER node
EXPOSE 5004
CMD ["node", "--max_old_space_size=20480", "dist/index.js"]
