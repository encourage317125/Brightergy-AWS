#Dockerfile for MEAN stack
#docker version 1.2.0, build fa7b24f
FROM docker.brighterlink.io:443/bldev/devbase:latest
MAINTAINER Samar Acharya <samar@techgaun.com>

ENV SRV_DIR /var/app
#install NPM modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN npm install -g nodemon
WORKDIR /var/app
#RUN ln -s /opt/brighterlink /var/app

EXPOSE 80
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
