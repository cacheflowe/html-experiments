#!/bin/sh

# compress jpgs
for FILENAME in `find ./ -name *.jpg`
do
  ./build/lib/jpg/jpegoptim --strip-all -q $FILENAME
  echo Compressing jpg: $FILENAME
done

for FILENAME in `find ./ -name *.jpeg`
do
  ./build/lib/jpg/jpegoptim --strip-all -q $FILENAME
  echo Compressing jpg: $FILENAME
done
