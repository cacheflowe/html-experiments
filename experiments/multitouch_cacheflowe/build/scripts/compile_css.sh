#!/bin/sh
# minify css
echo "compiling css files..."

# source the properties file as bash variables. [from: http://www.coderanch.com/t/419731/Linux-UNIX/read-properties-file-through-script]  
. ./build/compile.properties 

## build string of css files
compile_css_files=""
for i in ${css_frontend[@]}; do
  compile_css_files="${compile_css_files} $i"
done

# concat css files
cat $compile_css_files > ./stylesheets/interface-min.css

# minify css
java -jar ./build/lib/yuicompressor-2.4.2.jar -v ./stylesheets/interface-min.css -o ./stylesheets/interface-min.css

echo "...css compiled"
