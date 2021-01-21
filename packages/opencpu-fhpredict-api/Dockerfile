FROM technologiestiftung/flusshygiene-opencpu-base:v2.10.6-dev as base
LABEL maintainer="moron-zirfas@technologiestiftung-berlin.de"
LABEL "de.technologiestiftung-berlin"="Technologiestiftung Berlin"
LABEL description="This runs our package kwb-r/fhpredict package on a opencpu api"

ENV TMP "/tmp"
ENV TEMP "/tmp"

COPY opencpu-config/user.conf /etc/opencpu/server.conf.d/
# COPY build-r-installer.sh ./
# theese are needed and need to be provided in the environment
# ENV AUTH0_REQ_URL $AUTH0_REQ_URL
# ENV AUTH0_CLIENT_ID $AUTH0_CLIENT_ID
# ENV AUTH0_CLIENT_SECRET $AUTH0_CLIENT_SECRET
# ENV AUTH0_AUDIENCE $AUTH0_AUDIENCE
# ENV API_URL $API_URL
# ENV ENDPOINT_PROD $ENDPOINT_PROD
# ENV TOKEN_PROD $TOKEN_PROD

COPY ./opencpu-config/ /etc/opencpu/server.conf.d/
COPY ./dotfiles/.vimrc ~/

# -----------
# taken from https://github.com/opencpu/opencpu-server/blob/b3ad9ec2d94ca4142ffbc9c0aafaca0885a4caba/docker/rstudio/Dockerfile
# to enable rstudio for better customizastion of packages
# Install development tools
RUN \
  apt-get update && \
  apt-get install -y rstudio-server r-base-dev sudo curl git libcurl4-openssl-dev libssl-dev libxml2-dev libssh2-1-dev

# Workaround for rstudio apparmor bug
RUN echo "server-app-armor-enabled=0" >> /etc/rstudio/rserver.conf
RUN echo "www-address=127.0.0.1" >> /etc/rstudio/rserver.conf

# ----------
# RUN R -e "install.packages('devtools')" && echo "remove this when upgraded to next version of ocpu-base"
RUN  R -e "remotes::install_github('kwb-r/kwb.utils@v0.7.0', upgrade = 'never')"
RUN  R -e "remotes::install_github('kwb-r/kwb.dwd@v0.1.1', upgrade = 'never')"
RUN  R -e "remotes::install_github('kwb-r/kwb.flusshygiene@v0.3.0', upgrade = 'never')"
RUN  R -e "remotes::install_github('kwb-r/fhpredict@v0.16.0', upgrade = 'never')"
# RUN  R -e "remotes::install_github(\"kwb-r/fhpredict@v0.11.0\", build_vignettes = FALSE, force = TRUE, upgrade = \"never\")"
# RUN R -e "remotes::install_github(\"fabianmoronzirfas/rtestlib@master\", force = TRUE)"
EXPOSE 8004
EXPOSE 80

CMD service cron start && /usr/lib/rstudio-server/bin/rserver && apachectl -DFOREGROUND