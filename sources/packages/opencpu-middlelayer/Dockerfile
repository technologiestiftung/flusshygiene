# Production Dockerfile
FROM node:10.16.3-alpine as builder

LABEL maintainer="Fabian Morón Zirfas"
LABEL description="An middle layer between cms-spa and opencpu-api"

ENV NODE_ENV=development
WORKDIR /usr/app
COPY ./package*.json ./
RUN npm ci --quiet
COPY ./ ./
RUN npm run build
FROM node:10.16.3-alpine as app
WORKDIR  /home/node
ENV NODE_ENV=production
COPY ./package*.json ./
RUN npm ci --quiet
COPY --from=builder /usr/app/dist /home/node/dist
USER node
EXPOSE 4004
CMD ["node", "dist/index.js"]
