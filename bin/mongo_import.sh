#!/usr/bin/env bash

# PreRequisites
#   - Run bin/sync_gutenberg_txts.sh

catalog=${BASH_SOURCE%/*/*}/gutenberg/cache/epub/feeds/pg_catalog.csv.zip

[[ -z "$MONGO_APP_BOOK_COLLECTION" ]] && { echo "Missing MONGO_APP_BOOK_COLLECTION. Exiting."; exit 1; }
[[ -z "$MONGO_APP_USERNAME" ]] && { echo "Missing MONGO_APP_USERNAME. Exiting."; exit 1; }
[[ -z "$MONGO_APP_DB" ]] && { echo "Missing MONGO_APP_DB. Exiting."; exit 1; }
[[ -z "$MONGO_APP_PASSWORD" ]] && { echo "Missing MONGO_APP_PASSWD. Exiting."; exit 1; }
[[ ! -f "$catalog" ]] && { echo "Missing catalog file: ${catalog}. Exiting."; exit 2; }

echo "Using catalog: $catalog"

#unzip -p $catalog pg_catalog.csv \
cat ${catalog%/*}/pg_catalog.csv \
  | sed -e '1s/.*/id,type,issued,title,language,authors,subjects,locc,bookshelves/' \
  | mongoimport \
      --db $MONGO_APP_DB \
      --collection $MONGO_APP_BOOK_COLLECTION \
      --type csv \
      --headerline \
      --authenticationDatabase $MONGO_APP_DB --username $MONGO_APP_USERNAME --password $MONGO_APP_PASSWORD \
      --drop

exit $?
