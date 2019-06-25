FROM nginx:1.17.0-alpine as gateway
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak
COPY ./default.conf /etc/nginx/conf.d/default.conf
