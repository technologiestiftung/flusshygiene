FROM nginx:1.19.1-alpine as gateway
# FROM openresty/openresty::stretch-fat
ARG OCPU_USER
ARG OCPU_PW
ENV OCPU_USER $OCPU_USER
ENV OCPU_PW $OCPU_PW
RUN apk update && apk upgrade && \
  apk add apache2-utils && \
  rm -rf /var/cache/apk/* /tmp/*
WORKDIR /usr
COPY launch.sh  ./
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak
COPY default.conf timeout.conf /etc/nginx/conf.d/
# COPY ./timeout.conf /etc/nginx/conf.d/timeout.conf

CMD ["sh", "launch.sh"]