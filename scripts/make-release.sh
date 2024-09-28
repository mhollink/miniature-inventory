#!/bin/bash


cd "$(cd "$(dirname "$0")" && pwd)";

rm -rf ../release
rsync -a ../webpage/dist/ ../release/
rsync -a --exclude='.gitignore' --exclude='composer.json' --exclude='composer.lock' --exclude='Miniature Inventory.postman_collection.json' ../api ../release