#!/usr/bin/env bash

source "${BASH_SOURCE%/*}/vars.sh"

readonly IMAGE="docker.elastic.co/elasticsearch/elasticsearch:7.14.0"

podman run \
  --env ES_JAVA_OPS="-Xms512m -Xmx512m" \
  --env discovery.type="single-node" \
  --publish 127.0.0.1:9300:9300 \
  --publish 127.0.0.1:9200:9200 \
  --volume ${PREFIX}_elasticdb:/usr/share/elasticsearch/data:rw \
  --rm=true \
  --name ${PREFIX}_elasticdb $IMAGE
