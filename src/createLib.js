var fs = require('fs');
var JSONStream = require('JSONStream');
var ifError = require('./ifError.js');

function createLib(info, libDir) {
	var readStream = fs.createReadStream(info.libPath + '/package.json');
	var conversionStream = JSONStream.parse('main', function map(mainModule) {
		fs.writeFile(libDir + '/src/index.js', 'module.exports = require(\'./' + mainModule + '\');\n')
	});
	fs.writeFile(libDir + '/brjs-lib.conf', '', ifError(console.error));
	readStream.pipe(conversionStream);
}

module.exports = createLib;
