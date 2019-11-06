#vim: set ft=dockerfile:
FROM alpine:3.7

RUN apk add --no-cache bash vsftpd

RUN adduser -h /home/./files -s /bin/false -D files
RUN mv /etc/vsftpd/vsftpd.conf /etc/vsftpd/vsftpd.conf.orig
ADD vsftpd.conf /etc/vsftpd/vsftpd.conf
ADD entrypoint.sh /

VOLUME /home/files
VOLUME /home/files/data

EXPOSE 20 21 10090-10100

CMD /entrypoint.sh