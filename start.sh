#!/usr/bin/env sh
set -e
if [ ! -d node_modules ]; then
  echo "Once ./setup.sh calistirin."
  exit 1
fi
npm run dev
