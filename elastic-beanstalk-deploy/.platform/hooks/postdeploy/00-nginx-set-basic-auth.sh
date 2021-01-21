#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
sudo docker ps >/home/ec2-user/platform-hooks-postdeploy.txt
