#!/bin/bash

sudo docker ps | tee /tmp/platform-hooks-postdeploy.txt >/dev/null
