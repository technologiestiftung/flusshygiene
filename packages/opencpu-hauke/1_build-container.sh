#!/usr/bin/env bash

sudo docker build \
  --tag hauke/step-1:v0.1.0 \
  -f Dockerfile_1 \
  . | tee logs/step-1_build.log
