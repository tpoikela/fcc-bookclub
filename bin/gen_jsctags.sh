#! /usr/bin/sh

EXEC="node_modules/jsctags/bin/jsctags"
find . -type f -iregex ".*\.jsx?$" -not -path "./node_modules/*" -exec $EXEC {} -f \; | sed '/^$/d' | sort > tags
