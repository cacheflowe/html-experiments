#!/bin/sh
# lints your ./javascripts directory, and outputs the results to lint-report.txt

# create report directory if it doesn't exist
[ -a "build/reports" ] || mkdir ./build/reports

# get list of javascript files
find ./javascripts -name '*.js' > ./build/reports/js-files-tmp.txt

# strip /lib/ and /min/ files
grep -Ev '/min/|/lib/' ./build/reports/js-files-tmp.txt > ./build/reports/js-files-tmp2.txt

# build list of files to string
lint_files=""
while read line; do
  lint_files="${lint_files} $line"
done < ./build/reports/js-files-tmp2.txt

# remove temp files
rm ./build/reports/js-files-tmp.txt
rm ./build/reports/js-files-tmp2.txt

# run jslint on js files
java -jar ./build/lib/jslint4java-1.4.6.jar $lint_files > ./build/reports/lint-report-jslint.txt
