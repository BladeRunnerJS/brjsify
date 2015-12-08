var fs = require('fs');
var mkdirp = require('mkdirp');
var JSONStream = require('JSONStream');

var getFilesToExport = require('./getFilesToExport.js');
var getPathInfo = require('./getPathInfo.js');
var ifError = require('./ifError.js');

function createLib(libs, libDir, libName, libPackageJson) {
	if(!libs[libName]) {
		libs[libName] = true;

		mkdirp(libDir + '/src', function(error) {
			if(error) {
				console.error(error);
			}

			var readStream = fs.createReadStream(libPackageJson);
			var conversionStream = JSONStream.parse('main', function map(mainModule) {
				fs.writeFile(libDir + '/src/index.js', 'module.exports = require(\'./' + mainModule + '\');\n')
			});
			fs.writeFile(libDir + '/brjs-lib.conf', 'requirePrefix: ' + libName, ifError(console.error));
			readStream.pipe(conversionStream);
		});
	}
}

function exportFile(file, source) {
	var dir = file.replace(/(.*)\/.*/, '$1');

	mkdirp(dir, function(error) {
		if(error) {
			console.error(error);
		}

		fs.writeFile(file, source, ifError(console.error));
	});
}

function exportLibs(baseDir, outDir, verbose) {
	var packageJsonPath = baseDir + 'package.json';
	var libs = {};

	getFilesToExport(packageJsonPath, function(fileInfo) {
		var filePath = fileInfo.file.replace(baseDir, '');
		var pathInfo = getPathInfo(filePath);

		if(pathInfo.libName) {
			if(verbose) {
				console.log(pathInfo.relativeFilePath + ' (' + pathInfo.libName + ')');
			}

			var isScopedLib = pathInfo.libName.startsWith('@');
			var libName = ((!isScopedLib) ? pathInfo.libName : pathInfo.libName.replace('/', '-'));
			var libDir = outDir + libName;
			createLib(libs, libDir, pathInfo.libName, pathInfo.libPath + '/package.json');

			var outputFilePath = libDir + '/src/' + pathInfo.relativeFilePath;
			exportFile(outputFilePath, fileInfo.source);

			var legacyLibName, legacyLibDir;
			if(isScopedLib) {
				legacyLibName = pathInfo.libName.replace('@brjs', '@br').replace('@', '');
				legacyLibDir = outDir + legacyLibName.replace('/', '-');

				createLib(libs, legacyLibDir, legacyLibName, pathInfo.libPath + '/package.json');
			}
			else {
				legacyLibName = libName;
				legacyLibDir = libDir;
			}

			var legacyRelativeFilePath = pathInfo.relativeFilePath.replace('/modules/', '/');
			var legacyOutputFilePath = legacyLibDir + '/src/' + legacyRelativeFilePath;
			if(legacyOutputFilePath != outputFilePath) {
				var requirePath = pathInfo.libName + '/' + pathInfo.relativeFilePath.replace('.js', '');
				exportFile(legacyOutputFilePath, 'module.exports = require(\'' + requirePath + '\');');
			}
		}
	});
}

module.exports = exportLibs;
