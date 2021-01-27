#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
IMAGE=technologiestiftung/flusshygiene-opencpu-fhpredict-api:test-dev
print_usage() {
  printf "\n\nUsage:------------------------------\n"
  printf "Usage: %s -t yourtag\n" "${0}"
  printf "       If -t (tag)        flag is not specified it will use '%s'\n" $IMAGE
}

while getopts 't:' flag; do
  case "${flag}" in
  t) IMAGE="${OPTARG}" ;;
  *)
    print_usage
    exit 1
    ;;
  esac
done

docker run -it --env-file ./.env --publish 8004:8004 "$IMAGE"
