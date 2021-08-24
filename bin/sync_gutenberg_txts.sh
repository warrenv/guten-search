#!/usr/bin/env bash

# FYI: To sync the entire gutenberg project:
#   rsync -av --del aleph.gutenberg.org::gutenberg gutenberg_main

# North America | United States | San Diego      | Project Gutenberg
# High-speed mirror. Includes cache/generated files (epub, mobi, etc.).
mirror="${1:-rsync://gutenberg.pglaf.org/gutenberg}"

target="${2:-${BASH_SOURCE%/*/*}/gutenberg}"
mkdir -p "$target"

echo "Syncing zipped .txt files:"
echo "  mirror: '$mirror'"
echo "  target: '$target'"

# https://roboticape.com/2018/06/26/getting-all-the-books/
rsync -avm \
  --max-size=10m \
  --include="*/" \
  --exclude="*-*.zip" \
  --exclude="*/old/*" \
  --include="*.zip" \
  --exclude="*" \
  $mirror $target

exit $?
