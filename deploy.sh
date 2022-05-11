#!/usr/bin/bash
rm docs -r
npm run build
mv build/ docs/
git add docs/
git commit -m "deploy"
git push origin master