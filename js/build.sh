#!/bin/bash
nvm use lts/*
npm run build
echo "copy bundle to .../browser/static"
cp public/build/* ../src/collective/bookmarks/browser/static/
echo "done"

