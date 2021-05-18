#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
# https://git.io/JewS5
export $(grep -E -v '^#' .env | xargs -0)
GITHUB_REPOSITORY="technologiestiftung/flusshygiene"
GITHUB_REF="test"
SUFFIX=${PWD##*/}
STAGE="dev"
PUSHIT=FALSE

print_usage() {
  printf "\n\nUsage:------------------------------\n"
  printf "Usage: %s -t yourtag -s stage\n" "${0}"
  printf "       If -t flag is not specified it will use '%s'\n" $GITHUB_REF
  printf "       If -s flag is not specified it will use '%s'\n\n\n" $STAGE
  printf "       If -p flag is not specified it will not push to the remote '%s'\n\n\n" $PUSHIT

}

while getopts 'pt:s:' flag; do
  case "${flag}" in
  t) GITHUB_REF="${OPTARG}" ;;
  s) STAGE="${OPTARG}" ;;
  p) PUSHIT=TRUE ;;
  *)
    print_usage
    exit 1
    ;;
  esac
done

echo "${GITHUB_REPOSITORY}"
echo "${GITHUB_REF}"
echo "${SUFFIX}"
echo "${STAGE}"
echo "${PUSHIT}"

echo "Your image will be build with this repository/tag: '${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}'"

if [[ $PUSHIT == TRUE ]]; then
  echo "Your image will be pushed to docker hub"
fi
read -p "Are you sure?(y/n) " -n 1 -r
echo # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "abort!"
  print_usage
  exit 1
fi

docker build --build-arg GITHUB_PAT="${GITHUB_PAT}" --tag "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}" .

if [[ $PUSHIT == TRUE ]]; then
  docker push "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}"
fi
