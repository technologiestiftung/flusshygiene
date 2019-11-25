FROM docker/whalesay:latest
LABEL Name=flsshygn Version=2.2.0
RUN apt-get -y update && apt-get install -y fortunes
CMD /usr/games/fortune -a | cowsay
