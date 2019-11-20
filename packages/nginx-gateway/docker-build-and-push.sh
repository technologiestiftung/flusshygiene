#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

export GITHUB_REPOSITORY=technologiestiftung/flusshygiene
export GITHUB_REF=test
export SUFFIX=nginx-gateway
export STAGE=dev
export OCPU_PW=test
export OCPU_USER=test

print_usage() {
  printf "\n\nUsage:------------------------------\n"
  printf "Usage: script.sh -t yourtag -s stage\n"
  printf "       If -u flag is not specified it will use '%s'\n" $OCPU_USER
  printf "       If -p flag is not specified it will use '%s'\n" $OCPU_PW
  printf "       If -t flag is not specified it will use '%s'\n" $GITHUB_REF
  printf "       If -s flag is not specified it will use '%s'\n\n\n" $STAGE
}

while getopts 't:s:p:u:' flag; do
  case "${flag}" in
    t) GITHUB_REF="${OPTARG}" ;;
    s) STAGE="${OPTARG}" ;;
    p) OCPU_PW="${OPTARG}" ;;
    u) OCPU_USER="${OPTARG}" ;;
    *) print_usage
       exit 1 ;;
  esac
done


echo "${GITHUB_REPOSITORY}"
echo "${GITHUB_REF}"
echo "${SUFFIX}"
echo "${STAGE}"
echo "${OCPU_USER}"


 docker build --build-arg OCPU_USER="${OCPU_USER}" --build-arg OCPU_PW="${OCPU_PW}" --tag "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-dev" .

docker push "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-dev"