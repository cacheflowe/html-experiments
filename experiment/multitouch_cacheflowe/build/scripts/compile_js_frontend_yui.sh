#!/bin/sh

# source the properties file as bash variables. [from: http://www.coderanch.com/t/419731/Linux-UNIX/read-properties-file-through-script]  
. ./build/compile.properties 

# create min folder if it doesn't exist
[ -a "javascripts/min" ] || mkdir ./javascripts/min

echo "compiling library codes..."

## Compile any library code
compile_lib_files=""
for i in ${js_frontend[@]}; do
  compile_lib_files="${compile_lib_files} $i"
done

# concat js files
cat $compile_lib_files > ./javascripts/min/app-min.js

# minify js
java -jar ./build/lib/yuicompressor-2.4.2.jar -v ./javascripts/min/app-min.js -o ./javascripts/min/app-min.js

echo "...done"
