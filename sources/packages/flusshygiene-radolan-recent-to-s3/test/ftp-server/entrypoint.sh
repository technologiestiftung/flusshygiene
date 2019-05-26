#!/usr/bin/env bash
set -eo pipefail
IFS=$'\n\t'

if [ -z "${1}" ]; then
  /usr/sbin/vsftpd /etc/vsftpd/vsftpd.conf
else
  "${@}"
fi