#!/bin/bash


cd "$(cd "$(dirname "$0")" && pwd)";

rm -rf ../release
rsync -a ../app/dist/ ../release/
rsync -a \
  --include='vendor/***' \
  --include='public/***' \
  --include='src/***' \
  --include='.htaccess' \
  --include='firebase_sa.json' \
  --exclude='*' \
  ../api/ ../release/api/
