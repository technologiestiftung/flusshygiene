FROM node:12.18.4-alpine as builder
WORKDIR /usr/app
COPY package*.json ./
ENV NODE_ENV=development
RUN mkdir dist && npm ci --quiet
COPY ./ ./
RUN npm run build
FROM node:12.18.4-alpine as production
WORKDIR /usr/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm i
COPY --from=builder /usr/app/dist /usr/app/dist
COPY ./ ./
ENTRYPOINT ["node", "./dist/cli.js"]
CMD [""]
