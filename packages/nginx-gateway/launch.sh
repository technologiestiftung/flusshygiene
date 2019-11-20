#!/bin/sh
htpasswd -b -c /etc/nginx/.htpasswd "$OCPU_USER" "$OCPU_PW"
nginx -g "daemon off;"