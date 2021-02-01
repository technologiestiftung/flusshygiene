#!/bin/bash
set -ev
echo "running postdeploy"
date >/tmp/platform-hooks-postdeploy.txt
sudo docker ps | tee -a "/tmp/platform-hooks-postdeploy.txt" >/dev/null
