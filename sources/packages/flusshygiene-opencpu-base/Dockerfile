FROM opencpu/base:v2.1.3
# FROM opencpu/rstudio as base
LABEL maintainer="moron-zirfas@technologiestiftung-berlin.de"
LABEL "de.technologiestiftung-berlin"="Technologiestiftung Berlin"
# LABEL version="0.1.0"
# LABEL description="TODO"

# RUN  /bin/bash -c "[[ -z ${BUILD_DATE} ]] && exit 1 || MRAN=https://mran.microsoft.com/snapshot/${BUILD_DATE} && echo \"repo = '$MRAN'\""
ENV MAKEFLAGS="-j 2"
ENV MATRIX_EVAL="CC=gcc-7 && CXX=g++-7"
RUN mkdir -p ~/.R/ \
  && echo "CXX14 = g++-7 -fPIC -flto=2" >> ~/.R/Makevars \
  && echo "CXX14FLAGS = -mtune=native -march=native -Wno-unused-variable -Wno-unused-function -Wno-unused-local-typedefs -Wno-ignored-attributes -Wno-deprecated-declarations -Wno-attributes -O3" >> ~/.R/Makevars

RUN add-apt-repository ppa:ubuntu-toolchain-r/test && apt-get update \
  && apt-get -y install libudunits2-dev libgdal-dev libspatialite-dev g++-7 \
  && rm -rf /var/lib/apt/lists/*

# RUN echo https://mran.microsoft.com/snapshot/${BUILD_DATE}
# RUN BUILD_DATE=$(TZ="Europe/Berlin" date -I) &&


RUN MRAN=https://mran.microsoft.com/snapshot/2019-09-19 && \
 R -e "install.packages(c(\"remotes\", \"rstanarm\", \"sf\", \"fs\", \"raster\", \"sp\", \"lubridate\", \"httr\", \"Rcpp\", \"curl\"), repo = '$MRAN' );"

# RUN R -e "install.packages(\"remotes\");  remotes::install_version(\"rstanarm\", version = \"2.18.2\"); remotes::install_version(\"sf\", version = \"0.7-4\"); remotes::install_version('fs', version = '1.3.1'); remotes::install_version(\"raster\", version = \"2.8-19\"); remotes::install_version(\"sp\", version = \"1.3-1\"); remotes::install_version(\"lubridate\", version = \"1.7.4\"); remotes::install_version(\"httr\", version = \"1.4.1\"); remotes::install_version(\"Rcpp\", version = \"1.0.2\"); remotes::install_version(\"curl\", version = \"4.0\");"
EXPOSE 8004
EXPOSE 80