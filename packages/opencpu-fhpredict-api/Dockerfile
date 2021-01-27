# TODO: [BADEN-9] use fixed version if all test work
# FROM technologiestiftung/flusshygiene-opencpu-base:v2.10.6-dev
FROM technologiestiftung/flusshygiene-opencpu-base:test-dev
LABEL maintainer="moron-zirfas@technologiestiftung-berlin.de"
LABEL "de.technologiestiftung-berlin"="Technologiestiftung Berlin"
LABEL description="This runs our package kwb-r/fhpredict package on a opencpu api"

ENV TMP "/tmp"
ENV TEMP "/tmp"

COPY ./opencpu-config/ /etc/opencpu/server.conf.d/
COPY ./dotfiles/.vimrc /root

# At the very end, remove the "BH" package. It is very big in size and number of
# files and only required for package installation (I am assuming).
RUN R -e " \
  install <- function(x) remotes::install_github(x, upgrade = 'never') \
  ; install('KWB-R/kwb.utils@v0.5.0') \
  ; install('cloudyr/aws.s3@v0.3.12') \
  ; install('KWB-R/kwb.dwd@v0.1.0') \
  ; install('KWB-R/kwb.flusshygiene@v0.3.0') \
  ; install('KWB-R/fhpredict@v0.16.0') \
  ; remove.packages('BH', lib = './usr/lib/R/site-library')"

EXPOSE 8004
EXPOSE 80

CMD service cron start && apachectl -DFOREGROUND