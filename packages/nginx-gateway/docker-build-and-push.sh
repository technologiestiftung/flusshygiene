#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

GITHUB_REPOSITORY="technologiestiftung/flusshygiene"
GITHUB_REF="test"
SUFFIX=${PWD##*/}
STAGE="dev"
OCPU_PW="test"
OCPU_USER="test"
# PUSHIT=FALSE

print_usage() {
  printf "\n\nUsage:------------------------------\n"
  printf "Usage: %s -t yourtag -s stage\n" "${0}"
  printf "       If -u flag is not specified it will use '%s'\n" $OCPU_USER
  printf "       If -p flag is not specified it will use '%s'\n" $OCPU_PW
  printf "       If -t flag is not specified it will use '%s'\n" $GITHUB_REF
  printf "       If -s flag is not specified it will use '%s'\n\n\n" $STAGE
    # printf "       If -r flag is not specified it will not push to the remote '%s'\n\n\n" $PUSHIT

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

echo "Your image will be build with this repository/tag: '${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-${STAGE}'"
echo "Your user for the ocpu/test will be ${OCPU_USER}. Your pw will not be shown here"
read -p "Are you sure?(y/n) " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
  echo "abort!"
  print_usage
  exit 1
fi


 docker build --build-arg OCPU_USER="${OCPU_USER}" --build-arg OCPU_PW="${OCPU_PW}" --tag "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-dev" .

docker push "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-dev"