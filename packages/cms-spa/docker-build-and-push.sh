#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

#
# https://git.io/JewS5
export $(grep -E -v '^#' .env | xargs -0)
export GITHUB_REPOSITORY=technologiestiftung/flusshygiene
export GITHUB_REF=test
export SUFFIX=cms-spa
export STAGE=dev

print_usage() {
  printf "\n\nUsage:------------------------------\n"
  printf "Usage: script.sh -t yourtag -s stage\n"
  printf "       If -t tag is specified it will use '%s'\n" $GITHUB_REF
  printf "       If -s stage is specified it will use '%s'\n\n\n" $STAGE
}

while getopts 't:s:' flag; do
  case "${flag}" in
    t) GITHUB_REF="${OPTARG}" ;;
    s) STAGE="${OPTARG}" ;;
    *) print_usage
       exit 1 ;;
  esac
done


echo "${PORT}"
echo "${REACT_APP_MAPBOX_API_TOKEN}"
echo "${REACT_APP_AUTH0_DOMAIN}"
echo "${REACT_APP_AUTH0_CLIENTID}"
echo "${REACT_APP_AUTH0_AUDIENCE}"
echo "${REACT_APP_API_HOST}"
echo "${GITHUB_REPOSITORY}"
echo "${GITHUB_REF}"
echo "${SUFFIX}"
echo "${STAGE}"

docker build  --build-arg REACT_APP_MAPBOX_API_TOKEN="${REACT_APP_MAPBOX_API_TOKEN}" --build-arg REACT_APP_AUTH0_DOMAIN="${REACT_APP_AUTH0_DOMAIN}" --build-arg REACT_APP_AUTH0_CLIENTID"=${REACT_APP_AUTH0_CLIENTID}" --build-arg REACT_APP_AUTH0_AUDIENCE="${REACT_APP_AUTH0_AUDIENCE}" --tag "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}" .

docker push "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}"