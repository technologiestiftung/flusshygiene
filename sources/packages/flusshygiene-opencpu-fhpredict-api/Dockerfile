######## TODO #######
# Todos
# - add envs there
# change opencpu Password
######## https://hub.docker.com/r/opencpu/base/dockerfile #
# FROM opencpu/base:v2.1.3
FROM technologiestiftung/flusshygiene-opencpu-base:v0.5.0-dev as base
LABEL maintainer="moron-zirfas@technologiestiftung-berlin.de"
LABEL "de.technologiestiftung-berlin"="Technologiestiftung Berlin"
LABEL description="This runs our package kwb-r/fhpredict package on a opencpu api"

ENV TMP "/tmp"
ENV TEMP "/tmp"
# theese are needed and need to be provided in the environment
# ENV AUTH0_REQ_URL $AUTH0_REQ_URL
# ENV AUTH0_CLIENT_ID $AUTH0_CLIENT_ID
# ENV AUTH0_CLIENT_SECRET $AUTH0_CLIENT_SECRET
# ENV AUTH0_AUDIENCE $AUTH0_AUDIENCE
# ENV API_URL $API_URL
# ENV ENDPOINT_PROD $ENDPOINT_PROD
# ENV TOKEN_PROD $TOKEN_PROD

# COPY "./files/.vimrc" "~/"
RUN R -e "remotes::install_github(\"kwb-r/fhpredict@v0.1.1\", build_vignettes = FALSE, force= TRUE)"
# RUN R -e "remotes::install_github(\"fabianmoronzirfas/rtestlib@master\", force = TRUE)"
EXPOSE 8004
EXPOSE 80