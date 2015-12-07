var fs = require('fs');
var mkdirp = require('mkdirp');

var getFilesToExport = require('./getFilesToExport.js');
var legacyFilePath = require('./legacyFilePath.js');
var fileInfo = require('./fileInfo.js');
var createLib = require('./createLib.js');
var ifError = require('./ifError.js');

function exportFile(filePath, source, outDir, libs, verbose) {
	var info = fileInfo(filePath);

	if(info.libName) {
		if(verbose) {
			console.log(info.relativeFilePath + ' (' + info.libName + ')');
		}

		var isScopedLib = info.libName.startsWith('@');
		var libDir = outDir + ((!isScopedLib) ? info.libName : info.libName.substr(1).replace('/', '-'));
		var file = libDir + '/src/' + info.relativeFilePath;
		var dir = file.replace(/(.*)\/.*/, '$1');

		mkdirp(dir, function(error) {
			if(error) {
				console.error(error);
			}

			if(!libs[info.libName]) {
				createLib(info, libDir);
				libs[info.libName] = true;
			}

			fs.writeFile(file, source, ifError(console.error));
		});
	}
}

function exportLibs(baseDir, outDir, verbose) {
	var configPath = baseDir + 'package.json';
	var libs = {};

	getFilesToExport(configPath, function(fileConfig) {
		var filePath = fileConfig.file.replace(baseDir, '');
		exportFile(filePath, fileConfig.source, outDir, libs, verbose);

		var legacyPath = legacyFilePath(filePath);
		if(legacyPath != filePath) {
			var info = fileInfo(filePath);
			var requirePath = info.libName + '/' + info.relativeFilePath;
			exportFile(legacyPath, 'module.exports = require(\'' + requirePath + '\');', outDir, libs, verbose);
		}
	});
}

module.exports = exportLibs;
