#!/bin/sh
# lints your ./javascripts directory, and outputs the results to lint-report.txt

# create report directory if it doesn't exist
[ -a "build/reports" ] || mkdir ./build/reports

# run the build lint command - exclude the /lib directory
gjslint --strict --unix_mode --nojsdoc --exclude_directories ./javascripts/lib,./javascripts/min -r ./javascripts/ > ./build/reports/lint-report-tmp.txt

# remove unwanted errors from lint report
grep -Ev '0110|0005' ./build/reports/lint-report-tmp.txt > ./build/reports/lint-report-closure.txt

# remove over-active lint report
rm ./build/reports/lint-report-tmp.txt