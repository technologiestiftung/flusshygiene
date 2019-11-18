#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

export GITHUB_REPOSITORY=technologiestiftung/flusshygiene
export GITHUB_REF=test
export SUFFIX=nginx-gateway
export STAGE=dev

echo "${GITHUB_REPOSITORY}"
echo "${GITHUB_REF}"
echo "${SUFFIX}"
echo "${STAGE}"

 docker build  --tag "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-dev" .
docker push "${GITHUB_REPOSITORY}-${SUFFIX}:${GITHUB_REF}-dev"