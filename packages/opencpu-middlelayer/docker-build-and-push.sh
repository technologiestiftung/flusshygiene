#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
export GITHUB_REPOSITORY=technologiestiftung/flusshygiene
export GITHUB_REF=test
export SUFFIX=opencpu-middlelayer
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

echo "${GITHUB_REPOSITORY}"
echo "${GITHUB_REF}"
echo "${SUFFIX}"
echo "${STAGE}"

docker build  --tag "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}" .
docker push "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}"
