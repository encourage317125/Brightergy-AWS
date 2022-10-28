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

EB_CONFIG_HTTP_PORT=$(/opt/elasticbeanstalk/bin/get-config container -k instance_port)

if is_rhel; then
	cat > /etc/nginx/nginx.conf <<"EOF"
# Elastic Beanstalk Nginx Configuration File

user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log;

pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    access_log    /var/log/nginx/access.log;

    include       /etc/nginx/conf.d/*.conf;
    include       /etc/nginx/sites-enabled/*;
}
EOF

	mkdir -p /etc/nginx/sites-available
	mkdir -p /etc/nginx/sites-enabled
else
	error_exit "Unknown nginx distribution" 1
fi

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
gzip_min_length 10240;
gzip_comp_level 3;
gzip_disable "MSIE [1-6] \.";

map \$http_upgrade \$connection_upgrade {
	default		"upgrade";
	""			"";
}

server {
  listen $EB_CONFIG_HTTP_PORT default proxy_protocol;

  location ~* ^.+\.html.* {
    add_header Access-Control-Allow-Origin *;
    proxy_pass  http://docker;
    proxy_http_version 1.1;
    proxy_set_header	Connection			\$connection_upgrade;
		proxy_set_header	Upgrade				\$http_upgrade;
		proxy_set_header	Host				\$host;
		proxy_set_header	X-Real-IP			\$remote_addr;
		proxy_set_header	X-Forwarded-For		\$proxy_add_x_forwarded_for;
  }

  location ~* ^.+\.(css|js|ogg|ogv|svg|svgz|eot|otf|woff|mp4|ttf|rss|atom|jpg|jpeg|gif|png|ico|zip|tgz|gz|rar|bz2|doc|xls|exe|ppt|tar|mid|midi|wav|bmp|rtf).* {
    access_log off; log_not_found off; expires max;
    add_header Access-Control-Allow-Origin *;
    add_header Pragma public;
    add_header Cache-Control "max-age=315360, public";
    proxy_pass  http://docker;
    proxy_http_version 1.1;
    proxy_set_header	Connection			\$connection_upgrade;
		proxy_set_header	Upgrade				\$http_upgrade;
		proxy_set_header	Host				\$host;
		proxy_set_header	X-Real-IP			\$remote_addr;
		proxy_set_header	X-Forwarded-For		\$proxy_add_x_forwarded_for;
  }

  location / {
    proxy_pass http://docker;
    proxy_http_version 1.1;

    proxy_set_header	Connection			\$connection_upgrade;
		proxy_set_header	Upgrade				\$http_upgrade;
		proxy_set_header	Host				\$host;
		proxy_set_header	X-Real-IP			\$remote_addr;
		proxy_set_header	X-Forwarded-For		\$proxy_add_x_forwarded_for;
  }

  location /socket.io/ {
    proxy_pass http://docker;
    proxy_http_version 1.1;
    proxy_set_header	Connection			\$connection_upgrade;
		proxy_set_header	Upgrade				\$http_upgrade;
		proxy_set_header	Host				\$host;
		proxy_set_header	X-Real-IP			\$remote_addr;
		proxy_set_header	X-Forwarded-For		\$proxy_add_x_forwarded_for;
  }
}

server {
    server_name developers.brightergy.com support.brightergy.com;
    root /var/app/current/docs;
}
EOF
ln -sf /etc/nginx/sites-available/elasticbeanstalk-nginx-docker-proxy.conf /etc/nginx/sites-enabled/

mkdir -p /var/log/nginx

if is_rhel; then
	chown -R nginx:nginx /var/log/nginx
else
	error_exit "Unknown nginx distribution" 1
fi

service nginx stop
