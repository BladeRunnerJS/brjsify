var fs = require('fs');
var browserify = require('browserify');
var JSONStream = require('JSONStream');
var through = require('through2');
var ifError = require('./ifError.js');

function getFilesToExport(configPath, callback) {
	var readStream = fs.createReadStream(configPath, {defaultEncoding: 'utf8'});
	var conversionStream = JSONStream.parse('dependencies', function map(dependenciesMap) {
		var dependencies = Object.keys(dependenciesMap);
		return dependencies.map(function(dep) {return 'exports.' + dep + ' = require(\'' + dep +
			'\');'}).join('\n');
	});
	var writeStream = fs.createWriteStream('brjsify-program.js', {defaultEncoding: 'utf8'});
	var stream = readStream.pipe(conversionStream).pipe(writeStream);

	stream.on('finish', function() {
		var b = browserify('brjsify-program.js');
		b.pipeline.get('deps').push(through.obj(
			function(fileConfig, enc, next) {
				callback(fileConfig);
				next();
			},
			function() {
				fs.unlink('brjsify-program.js', ifError(console.error));
			}
		));
		b.bundle();
	});
}

module.exports = getFilesToExport;
