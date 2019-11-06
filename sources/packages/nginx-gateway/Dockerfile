FROM nginx:1.17.0-alpine as gateway
# FROM openresty/openresty::stretch-fat
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./timeout.conf /etc/nginx/conf.d/timeout.conf
