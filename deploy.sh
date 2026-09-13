#!/usr/bin/env bash
set -e

rm -rf docs
npm run build
mv build/ docs/
git add docs/
git commit -m "deploy"
git push origin master