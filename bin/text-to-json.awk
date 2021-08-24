#!/usr/bin/awk -f

# escape all double-quotes and index each line. let ES choose the index id.
# index_name and book_id must be set by the caller.

{gsub(/"/, "\\\""); printf "{\"index\": {\"_index\": \"%s\"}}\n{\"book_id\": %s,\"line\": %s,\"text\": \"%s\"}\n", index_name, book_id, NR, $0 }
