FROM technologiestiftung/flusshygiene-opencpu-base:v2.9.0-dev as base
LABEL maintainer="moron-zirfas@technologiestiftung-berlin.de"
LABEL "de.technologiestiftung-berlin"="Technologiestiftung Berlin"
LABEL description="This runs our package kwb-r/fhpredict package on a opencpu api"

ARG GITHUB_PAT
ENV TMP "/tmp"
ENV TEMP "/tmp"

COPY opencpu-config/user.conf /etc/opencpu/server.conf.d/
COPY build-r-installer.sh ./
# theese are needed and need to be provided in the environment
# ENV AUTH0_REQ_URL $AUTH0_REQ_URL
# ENV AUTH0_CLIENT_ID $AUTH0_CLIENT_ID
# ENV AUTH0_CLIENT_SECRET $AUTH0_CLIENT_SECRET
# ENV AUTH0_AUDIENCE $AUTH0_AUDIENCE
# ENV API_URL $API_URL
# ENV ENDPOINT_PROD $ENDPOINT_PROD
# ENV TOKEN_PROD $TOKEN_PROD

COPY ./opencpu-config/ /etc/opencpu/server.conf.d/
COPY ./files/.vimrc ~/
#
# RUN echo "GITHUB_PAT=${GITHUB_PAT}" >> $HOME/.Renviron && echo "" >> $HOME/.Renviron
# RUN ./build-r-installer.sh $GITHUB_PAT 0.9.1 > install.r && Rscript install.r && rm install.r

RUN R -e "install.packages('devtools')" && echo "remove this when upgraded to next version of ocpu-base"
RUN  R -e "remotes::install_github('kwb-r/kwb.utils@v0.5.0', upgrade = 'never', auth_token = devtools::github_pat(quiet = TRUE))"
RUN  R -e "remotes::install_github('kwb-r/kwb.dwd@v0.1.0', upgrade = 'never', auth_token = devtools::github_pat(quiet = TRUE))"
RUN  R -e "remotes::install_github('kwb-r/kwb.flusshygiene@v0.3.0', upgrade = 'never', auth_token = devtools::github_pat(quiet = TRUE))"
RUN  R -e "remotes::install_github('kwb-r/fhpredict@v0.12.0', upgrade = 'never', auth_token = devtools::github_pat(quiet = TRUE))"
# RUN  R -e "remotes::install_github(\"kwb-r/fhpredict@v0.11.0\", build_vignettes = FALSE, force = TRUE, upgrade = \"never\")"
# RUN R -e "remotes::install_github(\"fabianmoronzirfas/rtestlib@master\", force = TRUE)"
EXPOSE 8004
EXPOSE 80
