#!/bin/bash
BASEDIR=$(dirname $0)
sass --update $BASEDIR/../_sass:$BASEDIR/../css -t compressed
curl --data-urlencode js_code@$BASEDIR/../_js/main.js -d output_format=text -d output_info=compiled_code http://closure-compiler.appspot.com/compile > $BASEDIR/../js/main.js
