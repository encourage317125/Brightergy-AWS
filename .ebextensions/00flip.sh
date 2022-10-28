#!/bin/bash
#==============================================================================
# Copyright 2012 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# Licensed under the Amazon Software License (the "License"). You may not use
# this file except in compliance with the License. A copy of the License is
# located at
#
#       http://aws.amazon.com/asl/
#
# or in the "license" file accompanying this file. This file is distributed on
# an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or
# implied. See the License for the specific language governing permissions
# and limitations under the License.
#==============================================================================

set -e

. /opt/elasticbeanstalk/hooks/common.sh

EB_CONFIG_DOCKER_PORT_FILE=$(/opt/elasticbeanstalk/bin/get-config container -k port_file)

EB_CONFIG_DOCKER_STAGING_APP_FILE=$(/opt/elasticbeanstalk/bin/get-config container -k app_staging_file)
EB_CONFIG_DOCKER_CURRENT_APP_FILE=$(/opt/elasticbeanstalk/bin/get-config container -k app_deploy_file)

EB_CONFIG_DOCKER_IMAGE_STAGING=$(/opt/elasticbeanstalk/bin/get-config container -k staging_image)
EB_CONFIG_DOCKER_IMAGE_CURRENT=$(/opt/elasticbeanstalk/bin/get-config container -k deploy_image)

EB_CONFIG_HTTP_PORT=$(/opt/elasticbeanstalk/bin/get-config container -k instance_port)

# now the STAGING container is built and running, flip nginx to the new container
EB_CONFIG_NGINX_UPSTREAM_IP=$(docker inspect `cat $EB_CONFIG_DOCKER_STAGING_APP_FILE` | jq -r .[0].NetworkSettings.IPAddress)
EB_CONFIG_NGINX_UPSTREAM_PORT=`cat $EB_CONFIG_DOCKER_PORT_FILE`

#start datadog container
#DATADOG_STATUS=$(/opt/elasticbeanstalk/containerfiles/support/generate_env | grep ^DATADOG_STATUS | cut -d "=" -f2)
#(
#if [[ "x${DATADOG_STATUS-}" != "x" ]]; then
#  if ! /etc/init.d/datadog-agent status | grep "is running"; then
#    INSTANCE_TAG=$(/opt/elasticbeanstalk/containerfiles/support/generate_env | grep ^INSTANCE | cut -d "=" -f2)
#    if [[ "x${INSTANCE_TAG-}" != "x" ]]; then
#        sed -i "/tags: production/ctags: production, ${INSTANCE_TAG}" /etc/dd-agent/datadog.conf
#        sed -i "/#hostname:/chostname: ${INSTANCE_TAG}" /etc/dd-agent/datadog.conf
#    fi
#    /etc/init.d/datadog-agent start
#  fi
#fi
#)

# set up nginx
cat > /etc/nginx/conf.d/elasticbeanstalk-nginx-docker-upstream.conf <<EOF
upstream docker {
	server $EB_CONFIG_NGINX_UPSTREAM_IP:$EB_CONFIG_NGINX_UPSTREAM_PORT;
	keepalive 256;
}
EOF

# set up nginx server block configuration
cat > /etc/nginx/sites-available/elasticbeanstalk-nginx-docker-proxy.conf <<EOF
server_tokens off;
sendfile on;
tcp_nopush on;
tcp_nodelay on;
keepalive_timeout 15;
types_hash_max_size 2048;
open_file_cache max=200000 inactive=5s;
open_file_cache_valid 15s;
open_file_cache_min_uses 1;
open_file_cache_errors off;
client_max_body_size 10M;
large_client_header_buffers 8 5120k;
gzip on;
gzip_min_length 256;
gzip_comp_level 6;
gzip_disable "MSIE [1-6] \.";
gzip_vary on;
gzip_proxied any;
gzip_types application/x-font-ttf application/vnd.ms-fontobject font/opentype text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript;

map \$http_upgrade \$connection_upgrade {
	default		"upgrade";
	""			"";
}

server {
  listen $EB_CONFIG_HTTP_PORT default;
  error_page 502 /502.html;
  location = /502.html {
    root /usr/share/nginx/html;
    internal;
  }

  error_page 504 /504.html;
  location = /504.html {
    root /usr/share/nginx/html;
    internal;
  }
  location ~* ^.+\.html.* {
    add_header Access-Control-Allow-Origin *;
    root /var/app/current/front;
  }
  location ~* ^.+\.(css|js|ogg|ogv|svg|svgz|eot|otf|woff|mp4|ttf|rss|atom|jpg|jpeg|gif|png|ico|zip|tgz|gz|rar|bz2|doc|xls|exe|ppt|tar|mid|midi|wav|bmp|rtf).* {
    access_log off; log_not_found off; expires max;
    add_header Access-Control-Allow-Origin *;
    add_header Pragma public;
    add_header Cache-Control "max-age=315360, public";
    root /var/app/current/front;
    gzip_static on;
  }

  location / {
		proxy_pass			http://docker;
		proxy_http_version	1.1;

		proxy_set_header	Connection			\$connection_upgrade;
		proxy_set_header	Upgrade				\$http_upgrade;
		proxy_set_header	Host				\$host;
		proxy_set_header	X-Real-IP			\$remote_addr;
		proxy_set_header	X-Forwarded-For		\$proxy_add_x_forwarded_for;
	}
}
EOF

service nginx restart || error_exit "Failed to start nginx, abort deployment" 1

# stop and delete "current"
if [ -f $EB_CONFIG_DOCKER_CURRENT_APP_FILE ]; then
	EB_CONFIG_DOCKER_CURRENT_APP=`cat $EB_CONFIG_DOCKER_CURRENT_APP_FILE | cut -c 1-12`
	echo "Stopping current app container: $EB_CONFIG_DOCKER_CURRENT_APP..."

	if docker ps | grep -q $EB_CONFIG_DOCKER_CURRENT_APP; then
		stop_upstart_service eb-docker
	fi

	if docker ps | grep -q $EB_CONFIG_DOCKER_CURRENT_APP; then
		docker kill $EB_CONFIG_DOCKER_CURRENT_APP
	fi

	if docker ps -a | grep -q $EB_CONFIG_DOCKER_CURRENT_APP; then
		docker rm $EB_CONFIG_DOCKER_CURRENT_APP
	fi

	EB_CONFIG_DOCKER_IMAGE_ID_STAGING=`docker images | grep ^$EB_CONFIG_DOCKER_IMAGE_STAGING | awk '{ print $3 }'`
	EB_CONFIG_DOCKER_IMAGE_ID_CURRENT=`docker images | grep ^$EB_CONFIG_DOCKER_IMAGE_CURRENT | awk '{ print $3 }'`

	# this check is necessary since due to caching/config deploy these two could be the same image
	if [ "$EB_CONFIG_DOCKER_IMAGE_ID_STAGING" != "$EB_CONFIG_DOCKER_IMAGE_ID_CURRENT" ]; then
		docker rmi $EB_CONFIG_DOCKER_IMAGE_CURRENT || true
	fi
fi

# flip "STAGING" to "current"
echo "Making STAGING app container current..."
EB_CONFIG_DOCKER_IMAGE_ID_STAGING=`docker images | grep ^$EB_CONFIG_DOCKER_IMAGE_STAGING | awk '{ print $3 }'`
docker tag -f $EB_CONFIG_DOCKER_IMAGE_ID_STAGING $EB_CONFIG_DOCKER_IMAGE_CURRENT
docker rmi $EB_CONFIG_DOCKER_IMAGE_STAGING

mv $EB_CONFIG_DOCKER_STAGING_APP_FILE $EB_CONFIG_DOCKER_CURRENT_APP_FILE

# start monitoring it
start_upstart_service eb-docker

trace "Docker container `cat $EB_CONFIG_DOCKER_CURRENT_APP_FILE | cut -c 1-12` is running $EB_CONFIG_DOCKER_IMAGE_CURRENT."
