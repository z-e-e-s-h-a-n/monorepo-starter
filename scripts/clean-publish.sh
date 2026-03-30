#!/usr/bin/env bash

set -euo pipefail
cd "../"

if [ ! -d "templates" ]; then
  echo "templates directory not found"
  exit 0
fi

echo "Cleaning generated files from templates before publish..."
echo

find templates \
  \( -type d \( \
    -name node_modules -o \
    -name .next -o \
    -name .turbo -o \
    -name dist -o \
    -name build -o \
    -name coverage -o \
    -name .vercel -o \
    -name .cache -o \
    -name .history -o \
    -name logs \
  \) -prune -exec echo "[delete dir] {}" \; -exec rm -rf {} + \) -o \
  \( -type f -name 'npm-debug.log*' -exec echo "[delete file] {}" \; -exec rm -f {} + \)

echo
echo "Publish cleanup complete."
