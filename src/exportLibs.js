var fs = require('fs');
var mkdirp = require('mkdirp');

var getFilesToExport = require('./getFilesToExport.js');
var fileInfo = require('./fileInfo.js');
var createLib = require('./createLib.js');
var ifError = require('./ifError.js');

function exportLibs(baseDir, outDir, verbose) {
	var configPath = baseDir + 'package.json';
	var libs = {};

	getFilesToExport(configPath, function(fileConfig) {
		var info = fileInfo(baseDir, fileConfig.file);

		if(info.libName) {
			if(verbose) {
				console.log(info.relativeFilePath + ' (' + info.libName + ')');
			}

			var libDir = outDir + info.libName;
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

				fs.writeFile(file, fileConfig.source, ifError(console.error));
			});
		}
	});
}

module.exports = exportLibs;
