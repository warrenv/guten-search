#!/usr/bin/env bash

# This runs when the container starts and there is no database present.

mongo --authenticationDatabase admin --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD <<EOF
use $MONGO_APP_DB

db.createCollection("$MONGO_APP_BOOK_COLLECTION")

db.createUser(
  {
    user: "$MONGO_APP_USERNAME",
    pwd: "$MONGO_APP_PASSWORD",
    roles: [ { role: "readWrite", db: "$MONGO_APP_DB" } ]
  }
)

use $MONGO_APPTEST_DB

db.createCollection("$MONGO_APP_BOOK_COLLECTION")

db.createUser(
  {
    user: "$MONGO_APPTEST_USERNAME",
    pwd: "$MONGO_APPTEST_PASSWORD",
    roles: [ { role: "readWrite", db: "$MONGO_APPTEST_DB" } ]
  }
)
EOF
