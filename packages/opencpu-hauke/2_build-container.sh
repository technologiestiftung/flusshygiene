#!/usr/bin/env bash

#cp -r ../opencpu-fhpredict-api/opencpu-config/ .
#cp -r ../opencpu-fhpredict-api/files/ .

# Do export GITHUB_PAT=... in the shell that calls this script
#echo GITHUB_PAT: $GITHUB_PAT

sudo docker build \
  --build-arg GITHUB_PAT=$GITHUB_PAT \
  --tag hauke/step-2:v0.1.0 \
  -f Dockerfile_2 \
  . | tee logs/step-2_build.log
