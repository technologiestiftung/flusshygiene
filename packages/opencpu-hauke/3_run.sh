#!/usr/bin/env bash

sudo docker run \
  -it \
  --detach \
  --env-file .env \
  --publish 8004:8004 \
  hauke/step-2:v0.1.0
  
echo "Next steps:"
echo "- Open localhost:8004/rstudio in a browser"
echo "- Open localhost:8004/ocpu/test in a browser"
