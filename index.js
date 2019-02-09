#!/usr/bin/env node
const { convert } = require("./lib/convert");

var source = require('fs').readFileSync('/dev/stdin', 'utf8');

console.log(convert(source));
