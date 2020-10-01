#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

tag=$(git describe --abbrev=0 --tags)

images=(
  "technologiestiftung/flusshygiene-cms-spa:${tag}-dev"
  "technologiestiftung/flusshygiene-cronbot:${tag}-dev"
  "technologiestiftung/flusshygiene-helpdesk-mailer:${tag}-dev"
  "technologiestiftung/flusshygiene-nginx-gateway:${tag}-dev"
  "technologiestiftung/flusshygiene-opencpu-base:${tag}-dev"
  "technologiestiftung/flusshygiene-opencpu-fhpredict-api:${tag}-dev"
  "technologiestiftung/flusshygiene-opencpu-middlelayer:${tag}-dev"
  "technologiestiftung/flusshygiene-postgres-api:${tag}-dev"
  "technologiestiftung/flusshygiene-radolan-recent:${tag}-dev"
  "technologiestiftung/flusshygiene-radolan-recent-to-s3:${tag}-dev"
)
for i in "${images[@]}"; do
  docker pull "$i"
done
