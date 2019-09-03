FROM opencpu/base:v2.1.3
# FROM opencpu/rstudio as base
LABEL maintainer="moron-zirfas@technologiestiftung-berlin.de"
LABEL "de.technologiestiftung-berlin"="Technologiestiftung Berlin"
# LABEL version="0.1.0"
# LABEL description="TODO"

ENV MAKEFLAGS="-j 2"
ENV MATRIX_EVAL="CC=gcc-7 && CXX=g++-7"
RUN mkdir -p ~/.R/ \
  && echo "CXX14 = g++-7 -fPIC -flto=2" >> ~/.R/Makevars \
  && echo "CXX14FLAGS = -mtune=native -march=native -Wno-unused-variable -Wno-unused-function -Wno-unused-local-typedefs -Wno-ignored-attributes -Wno-deprecated-declarations -Wno-attributes -O3" >> ~/.R/Makevars


# RUN mkdir -p /home/opencpu/.R/ && echo "CXX14FLAGS=-O3 -march=native -mtune=native -fPIC" && echo "CXX14=g++" >> /home/opencpu/.R/Makevars && chown opencpu:www-data -R /home/opencpu/.R/

RUN add-apt-repository ppa:ubuntu-toolchain-r/test && apt-get update \
  && apt-get -y install libudunits2-dev libgdal-dev libspatialite-dev g++-7 \
  && rm -rf /var/lib/apt/lists/*
# RSTAN needs at least 4GB of memory!!! ARGGGHHHHHHHH!!!!!!!1!!!!
RUN R -e "install.packages(c(\"remotes\", \"rstanarm\"));"

EXPOSE 8004
EXPOSE 80