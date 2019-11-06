FROM node:10.16.3-alpine as builder
LABEL maintainer="Fabian Morón Zirfas"
# LABEL version="1.0.0"
LABEL description="A frontend for a the  postgres/postgis api used in the project flusshygiene"
ENV NODE_ENV=development

# https://github.com/docker/compose/issues/1837#issuecomment-316896858
# When building a Docker image from the commandline, you can set those values using –build-arg:
# docker build --build-arg some_variable_name=a_value
ARG PORT
ARG REACT_APP_MAPBOX_API_TOKEN
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_CLIENTID
ARG REACT_APP_AUTH0_AUDIENCE
ARG REACT_APP_API_HOST

ENV PORT $PORT
ENV REACT_APP_MAPBOX_API_TOKEN $REACT_APP_MAPBOX_API_TOKEN
ENV REACT_APP_AUTH0_DOMAIN $REACT_APP_AUTH0_DOMAIN
ENV REACT_APP_AUTH0_CLIENTID $REACT_APP_AUTH0_CLIENTID
ENV REACT_APP_AUTH0_AUDIENCE $REACT_APP_AUTH0_AUDIENCE
ENV REACT_APP_API_HOST ""
# the line below is for localtesting
# ENV REACT_APP_API_HOST $REACT_APP_API_HOST

WORKDIR /usr/app
COPY ./package*.json ./
RUN npm ci --quiet
COPY ./ ./
RUN npm run build
FROM node:10.16.3-alpine as app
WORKDIR  /usr/app
ENV NODE_ENV=production
COPY --from=builder /usr/app/build ./build
COPY ./server/package*.json ./
RUN npm ci --quiet
COPY ./server/* ./
USER node
EXPOSE ${PORT}
CMD [ "node" , "index.js"]

