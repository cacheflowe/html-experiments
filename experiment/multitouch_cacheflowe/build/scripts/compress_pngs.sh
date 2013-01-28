#!/bin/sh

# compress pngs
for FILENAME in `find ./ -name *.png`
do
  ./build/lib/img/png/optipng -o7 -q $FILENAME
  ./build/lib/img/png/advpng -z -4 -q $FILENAME
  ./build/lib/img/png/pngout -q $FILENAME
  echo Compressing png: $FILENAME
done
