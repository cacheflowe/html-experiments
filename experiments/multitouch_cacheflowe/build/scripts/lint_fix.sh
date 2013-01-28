#!/bin/sh

# create backup dir if not already there
[ -a "build/backups" ] || mkdir ./build/backups

# create timestamped backup dir
TIMESTAMP=$(date +%Y%m%d-%H.%M.%S)
mkdir ./build/backups/javascripts-$TIMESTAMP

# backup files to new dir
cp -r ./javascripts/* ./build/backups/javascripts-$TIMESTAMP

# run closure compiler fix command
fixjsstyle --nojsdoc --strict --nodisable_indentation_fixing --exclude_directories ./javascripts/lib -r ./javascripts/*
