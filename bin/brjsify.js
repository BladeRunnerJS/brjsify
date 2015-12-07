#!/usr/bin/env node

var exportLibs = require('../src/exportLibs.js');

var args = process.argv.slice(2);
var baseDir = process.cwd() + '/';
var outDir = args[0];
var verbose = true; // TODO: add support for externally configured verbose flag

exportLibs(baseDir, outDir, verbose);
