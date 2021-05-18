#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

USERNAME=opencpu && PASSWORD=$(date +%s | sha256sum | base64 | head -c 43) && ID=$(sudo docker ps -aqf "name=nginx") && sudo docker exec -it $ID /bin/sh -c "htpasswd -bc /etc/nginx/.htpasswd $USERNAME $PASSWORD && echo $PASSWORD > PASSWORD.txt"

sudo docker exec -it $ID /bin/sh -c "cat PASSWORD.txt"
