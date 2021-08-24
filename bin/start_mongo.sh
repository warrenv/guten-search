#!/usr/bin/env bash

source "${BASH_SOURCE%/*}/vars.sh"

readonly IMAGE="docker.io/mongo:3.6"
#readonly IMAGE="docker.io/mongo:4.4"

podman run \
  --env MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME:-root} \
  --env MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD:-development} \
  --env MONGO_APP_DB=${MONGO_APP_DB:-gutenberg} \
  --env MONGO_APP_USERNAME=${MONGO_APP_USERNAME:-app} \
  --env MONGO_APP_PASSWORD=${MONGO_APP_PASSWORD:-development} \
  --env MONGO_APP_BOOK_COLLECTION=${MONGO_APP_BOOK_COLLECTION:-books} \
  --env MONGO_APPTEST_DB=${MONGO_APPTEST_DB:-gutenberg-test} \
  --env MONGO_APPTEST_USERNAME=${MONGO_APPTEST_USERNAME:-test} \
  --env MONGO_APPTEST_PASSWORD=${MONGO_APPTEST_PASSWORD:-development} \
  --volume ${PREFIX}_mongodb:/data/db \
  --volume ./gutenberg:/data/gutenberg:Z \
  --volume ./bin:/data/bin:Z \
  --volume ./db/mongo/initdb:/docker-entrypoint-initdb.d:Z \
  --publish 127.0.0.1:27017:27017 \
  --rm=true \
  --name ${PREFIX}_mongodb $IMAGE
