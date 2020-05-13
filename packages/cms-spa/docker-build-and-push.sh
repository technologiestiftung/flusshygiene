#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

#
# https://git.io/JewS5
export $(grep -E -v '^#' .env | xargs -0)
export $(grep -E -v '^#' .env.local | xargs -0)
GITHUB_REPOSITORY="technologiestiftung/flusshygiene"
GITHUB_REF="test"
SUFFIX=${PWD##*/}
STAGE="dev"
DOCKERFILE="./Dockerfile"
PUSHIT=FALSE

print_usage() {
  printf "\n\nUsage:------------------------------\n"
  printf "Usage: %s -t yourtag -s stage\n" "${0}"
  printf "       If -t (tag)        flag is not specified it will use '%s'\n" $GITHUB_REF
  printf "       If -s (stage)      flag is not specified it will use '%s'\n\n\n" $STAGE
  printf "       If -d (Dockerfile) flag is not specified it will use '%s'\n\n\n" $DOCKERFILE
  printf "       If -p flag is not specified it will not push to the remote '%s'\n\n\n" $PUSHIT
}

while getopts 'pt:s:d:' flag; do
  case "${flag}" in
    t) GITHUB_REF="${OPTARG}" ;;
    s) STAGE="${OPTARG}" ;;
    d) DOCKERFILE="${OPTARG}" ;;
    p) PUSHIT=TRUE ;;

    *) print_usage
       exit 1 ;;
  esac
done


# echo "${GITHUB_REPOSITORY}"
# echo "${GITHUB_REF}"
# echo "${SUFFIX}"
# echo "${STAGE}"
# echo "${DOCKERFILE}"

echo "Your image will be build with this repository/tag: '${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}'"
if [[ $PUSHIT == TRUE ]]
  then
    echo "and pushed to the docker registry"
  else
    echo "NOT be pushed to the docker registry"
fi
echo "Your Dockerfile will be: ${DOCKERFILE}"
echo "Your express port will be: ${PORT}"
echo "Values taken from .env:"
echo
echo "REACT_APP_MAPBOX_API_TOKEN: ${REACT_APP_MAPBOX_API_TOKEN}"
echo "REACT_APP_AUTH0_DOMAIN: ${REACT_APP_AUTH0_DOMAIN}"
echo "REACT_APP_AUTH0_CLIENTID: ${REACT_APP_AUTH0_CLIENTID}"
echo "REACT_APP_AUTH0_AUDIENCE: ${REACT_APP_AUTH0_AUDIENCE}"
echo "REACT_APP_API_HOST: ${REACT_APP_API_HOST}"
echo "REACT_APP_EVENT_SOURCE_URL: ${REACT_APP_EVENT_SOURCE_URL}"
echo "REACT_APP_ADMIN_MAIL: ${REACT_APP_ADMIN_MAIL}"
echo
read -p "Are you sure?(y/N) " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
  print_usage
  exit 1
fi

docker build  --build-arg REACT_APP_ADMIN_MAIL="${REACT_APP_ADMIN_MAIL}" --build-arg REACT_APP_MAPBOX_API_TOKEN="${REACT_APP_MAPBOX_API_TOKEN}" --build-arg REACT_APP_AUTH0_DOMAIN="${REACT_APP_AUTH0_DOMAIN}" --build-arg REACT_APP_EVENT_SOURCE_URL="${REACT_APP_EVENT_SOURCE_URL}" --build-arg REACT_APP_AUTH0_CLIENTID="${REACT_APP_AUTH0_CLIENTID}" --build-arg REACT_APP_AUTH0_AUDIENCE="${REACT_APP_AUTH0_AUDIENCE}" --tag "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}" -f "${DOCKERFILE}" .
if [[ $PUSHIT == TRUE ]]
  then
docker push "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}"
fi