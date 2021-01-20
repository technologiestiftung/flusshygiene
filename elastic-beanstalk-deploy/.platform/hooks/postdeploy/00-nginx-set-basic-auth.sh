#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
sudo docker ps >~/platform-hooks-postdeploy.txt
