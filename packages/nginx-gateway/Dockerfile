FROM nginx:1.19.3-alpine as gateway
RUN apk update && apk upgrade && \
  apk add apache2-utils && \
  rm -rf /var/cache/apk/* /tmp/*
WORKDIR /usr
# COPY launch.sh  ./
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak
COPY default.conf timeout.conf /etc/nginx/conf.d/
# COPY ./timeout.conf /etc/nginx/conf.d/timeout.conf
#
# https://github.com/nginx-proxy/nginx-proxy/issues/456#issuecomment-494072188
# dynamically create password
RUN USERNAME=opencpu && \
  PASSWORD=$(date +%s | sha256sum | base64 | head -c 43) && \
  htpasswd -bc /etc/nginx/.htpasswd $USERNAME "$PASSWORD" && \
  echo "$PASSWORD" > PASSWORD.txt && \
  echo "the password generated here will be replaced by elastic benastalk postdeploy hooks"
# ↗ this line persists the password in a file inside the docker image.
# Depending on your security threat model, this may be insecure. You can remove that line.
# only do this in development
# RUN printf "\n\t file PASSWORD.txt:: \n" && \
#     cat PASSWORD.txt && \
#     printf "\n"

# CMD ["sh", "launch.sh"]