#!/bin/bash

sudo docker ps | tee "$HOME/platform-hooks-postdeploy.txt" >/dev/null
