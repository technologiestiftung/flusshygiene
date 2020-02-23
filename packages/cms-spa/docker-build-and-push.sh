#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

#
# https://git.io/JewS5
export $(grep -E -v '^#' .env | xargs -0)
GITHUB_REPOSITORY="technologiestiftung/flusshygiene"
GITHUB_REF="test"
SUFFIX=${PWD##*/}
STAGE="dev"

print_usage() {
  printf "\n\nUsage:------------------------------\n"
  printf "Usage: %s -t yourtag -s stage\n" "${0}"
  printf "       If -t flag is not specified it will use '%s'\n" $GITHUB_REF
  printf "       If -s flag is not specified it will use '%s'\n\n\n" $STAGE
}

while getopts 't:s:' flag; do
  case "${flag}" in
    t) GITHUB_REF="${OPTARG}" ;;
    s) STAGE="${OPTARG}" ;;
    *) print_usage
       exit 1 ;;
  esac
done


# echo "${GITHUB_REPOSITORY}"
# echo "${GITHUB_REF}"
# echo "${SUFFIX}"
# echo "${STAGE}"

echo "Your image will be build with this repository/tag: '${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}'"
echo "Your express port will be: ${PORT}"
echo "REACT_APP_MAPBOX_API_TOKEN: ${REACT_APP_MAPBOX_API_TOKEN}"
echo "REACT_APP_AUTH0_DOMAIN: ${REACT_APP_AUTH0_DOMAIN}"
echo "REACT_APP_AUTH0_CLIENTID: ${REACT_APP_AUTH0_CLIENTID}"
echo "REACT_APP_AUTH0_AUDIENCE: ${REACT_APP_AUTH0_AUDIENCE}"
echo "REACT_APP_API_HOST: ${REACT_APP_API_HOST}"

read -p "Are you sure?(y/n) " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
  echo "abort!"
  print_usage
  exit 1
fi

docker build  --build-arg REACT_APP_MAPBOX_API_TOKEN="${REACT_APP_MAPBOX_API_TOKEN}" --build-arg REACT_APP_AUTH0_DOMAIN="${REACT_APP_AUTH0_DOMAIN}" --build-arg REACT_APP_AUTH0_CLIENTID="${REACT_APP_AUTH0_CLIENTID}" --build-arg REACT_APP_AUTH0_AUDIENCE="${REACT_APP_AUTH0_AUDIENCE}" --tag "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}" .

docker push "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}"