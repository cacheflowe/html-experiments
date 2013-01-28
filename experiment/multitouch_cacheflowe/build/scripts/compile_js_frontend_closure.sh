#!/bin/sh

# source the properties file as bash variables. [from: http://www.coderanch.com/t/419731/Linux-UNIX/read-properties-file-through-script]  
. ./build/compile.properties 
 
# # Then reference then:  
#echo "My name is $javascripts and I'm years old."

echo "compiling front-end codes..."

# create min folder if it doesn't exist
[ -a "javascripts/min" ] || mkdir ./javascripts/min

# buid the string of local files to concat
compile_files=""
for i in $(echo $js_frontend | tr "," "\n")
do
  next_script=" --js $i"
  compile_files="${compile_files}${next_script}"
done

# run the compiler
java -jar ./build/lib/compiler.jar $compile_files --js_output_file ./javascripts/min/app-min.js

echo "...done"
