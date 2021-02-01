#!/bin/bash
set -ev
echo "running confighooks postdeploy"
date >/tmp/platform-confighooks-postdeploy.txt
sudo docker ps | tee -a "/tmp/platform-confighooks-postdeploy.txt" >/dev/null
