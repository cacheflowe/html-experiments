#!/bin/sh

# source the properties file as bash variables. [from: http://www.coderanch.com/t/419731/Linux-UNIX/read-properties-file-through-script]  
. ./build/compile.properties 

# create min folder if it doesn't exist
[ -a "deploy/javascripts/min" ] || mkdir ./deploy/javascripts/min

echo "compiling library codes..."

## Compile any library code
compile_lib_files=""
for i in ${js_lib[@]}; do
  compile_lib_files="${compile_lib_files} --js $i"
done

# run the compiler
java -jar ./build/lib/compiler.jar $compile_lib_files --js_output_file ./deploy/javascripts/min/lib-min.js

echo "...done"
