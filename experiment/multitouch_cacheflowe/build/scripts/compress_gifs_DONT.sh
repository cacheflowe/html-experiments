#!/bin/sh

# compress gifs
for FILENAME in `find ./ -name *.gif`
do
  ./build/lib/img/gif/gifsicle -i -b -O3 $FILENAME
  echo Compressing: $FILENAME
done