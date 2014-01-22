#!/bin/bash
BASEDIR=$(dirname $0)
sass --update $BASEDIR/../_sass:$BASEDIR/../css -t compressed
