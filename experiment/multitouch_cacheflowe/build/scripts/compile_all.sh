#!/bin/sh

# source the properties file as bash variables. [from: http://www.coderanch.com/t/419731/Linux-UNIX/read-properties-file-through-script]  
. ./build/compile.properties 

echo "!!! compiling site..."

# Run build all commands
for i in ${compile_routine[@]}; do
  $i
done

echo "!!! site is tight"

