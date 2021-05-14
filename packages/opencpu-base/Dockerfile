FROM opencpu/base:2.2.2
LABEL maintainer="moron-zirfas@technologiestiftung-berlin.de"
LABEL "de.technologiestiftung-berlin"="Technologiestiftung Berlin"

RUN mv /etc/opencpu/server.conf /etc/opencpu/server.conf.bak
COPY ./server.conf /etc/opencpu/server.conf

RUN add-apt-repository ppa:c2d4u.team/c2d4u4.0+ \
  && apt-get update \
  && apt-get install -y \
  r-cran-rstanarm=2.21.1-1cran1.2004.0 \
  r-cran-units=0.6-7-1cran1.2004.0 \
  r-cran-raster=3.4-5-1cran1.2004.0 \
  r-cran-rcurl=1.98-1.2-1cran1.2004.0 \
  r-cran-sf=0.9-7-1cran1.2004.0 \
  r-cran-dplyr=1.0.3-1cran1.2004.0 \
  r-cran-modelmetrics=1.2.2.2-1cran1.2004.0 \
  r-cran-caret=6.0-86-1cran1.2004.0 \
  r-cran-fs=1.5.0-1cran1.2004.0 \
  r-cran-httr=1.4.2-1cran1.2004.0 \
  r-cran-aws.signature=0.6.0-1cran1.2004.0 \
  r-cran-xml2=1.3.2-1cran1.2004.0 \
  r-cran-lmtest=0.9.37-2.1~ubuntu20.04.1~ppa1 \
  && apt-get clean

EXPOSE 8004
EXPOSE 80
