#!/bin/sh

# source the properties file as bash variables. [from: http://www.coderanch.com/t/419731/Linux-UNIX/read-properties-file-through-script]  
. ./build/compile.properties 
 
# # Then reference then:  
#echo "My name is $javascripts and I'm years old."

echo "compiling front-end codes..."

# create min folder if it doesn't exist
[ -a "javascripts/min" ] || mkdir ./javascripts/min

# buid the string of local files to concat
# js_frontend="javascripts/multitouch.js,javascripts/app_init.js,javascripts/debug.js"
compile_files=""
for i in $(echo $js_frontend | tr "," "\n")
do
  next_script=" --js $i"
  compile_files="${compile_files}${next_script}"
done

# run the compiler
java -jar ./build/lib/compiler.jar $compile_files --js_output_file ./javascripts/min/app-min.js

echo "...done"
echo "compiling library codes..."

## Compile any library code
compile_lib_files=""
for i in ${js_lib[@]}; do
  compile_lib_files="${compile_lib_files} --js $i"
done

# run the compiler
java -jar ./build/lib/compiler.jar $compile_lib_files --js_output_file ./javascripts/min/lib-min.js
echo "...done"
echo "compiling css files..."


# minify css

## build string of css files
compile_css_files=""
for i in ${css_frontend[@]}; do
  compile_css_files="${compile_css_files} $i"
done

# concat css files
cat $compile_css_files > ./stylesheets/interface-min.css

# minify css
java -jar ./build/lib/yuicompressor-2.4.2.jar -v ./stylesheets/interface-min.css -o ./stylesheets/interface-min.css

echo "...css"
