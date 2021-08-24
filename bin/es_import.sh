#!/usr/bin/env bash

[[ -z "$1" ]] && { echo "usage: ${BASH_SOURCE##*/} index_name"; exit 1; }

readonly index=$1
readonly import_subdirs=${2:-gutenberg/[0-9]}

date > es_bulk_import.time

echo "Deleting index '$index'..."
curl -XDELETE localhost:9200/$index

#find gutenberg/[0-9] -name "*.zip" \
find $import_subdirs -name "*.zip" \
  | while read zfile; do echo "$zfile ${zfile##*/}"; done \
  | sed -e 's/\.zip$/.txt/' \
  | (
      while read zfile tfile; do
        echo "Processing '$zfile'..."

        unzip -p $zfile $tfile \
          | awk \
              -v RS='\r\n' \
              -v index_name=$index \
              -v book_id=${tfile%.*} \
              -f ${BASH_SOURCE%/*}/text-to-json.awk \
          | curl \
              -H 'Content-Type: application/x-ndjson' \
              -XPOST 'localhost:9200/_bulk?pretty' \
              --data-binary @-
      done
    )
st=$?

date >> es_bulk_import.time
exit $st
