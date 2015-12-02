#!/usr/bin/env node

var fs = require('fs');
var mkdirp = require('mkdirp');
var JSONStream = require('JSONStream');
var getFilesToExport = require('../src/getFilesToExport.js');
var ifError = require('../src/ifError.js');

var args = process.argv.slice(2);
var baseDir = process.cwd() + '/';
var configPath = baseDir + 'package.json';
var outDir = args[0];
var verbose = false; // TODO: add support for a verbose flag

function fileInfo(filePath) {
	var filePath = filePath.replace(baseDir, '');
	var libRelativeFilePath = filePath.replace(/.*node_modules\//, '');
	var sepPos = libRelativeFilePath.indexOf('/');
	var libName = libRelativeFilePath.substring(0, sepPos);
	var relativeFilePath = libRelativeFilePath.substring(sepPos + 1, libRelativeFilePath.length);
	var libPath = filePath.replace(new RegExp('(' + libName + ')/.*'), '$1');

	return {filePath: filePath, libName: libName, relativeFilePath: relativeFilePath, libPath: libPath};
}

var libs = {};
getFilesToExport(configPath, function(fileConfig) {
	var info = fileInfo(fileConfig.file);

	if(info.libName) {
		if(verbose) {
			console.log(info.relativeFilePath + ' (' + info.libName + ')');
		}

		var libDir = outDir + info.libName;
		var file = libDir + '/src/' + info.relativeFilePath;
		var dir = file.replace(/(.*)\/.*/, '$1');

		if(!libs[info.libName]) {
			var readStream = fs.createReadStream(info.libPath + '/package.json');
			var conversionStream = JSONStream.parse('main', function map(mainModule) {
				fs.writeFile(libDir + '/src/index.js', 'module.exports = require(\'./' + mainModule + '\');\n')
			});
			fs.writeFile(libDir + '/brjs-lib.conf', '', ifError(console.error));
			readStream.pipe(conversionStream);
			libs[info.libName] = true;
		}

		mkdirp(dir, function(error) {
			if(error) {
				console.error(error);
			}

			fs.writeFile(file, fileConfig.source, ifError(console.error));
		});
	}
});
