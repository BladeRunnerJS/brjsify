function fileInfo(baseDir, filePath) {
	var filePath = filePath.replace(baseDir, '');
	var libRelativeFilePath = filePath.replace(/.*node_modules\//, '');
	var sepPos = libRelativeFilePath.indexOf('/');
	var libName = libRelativeFilePath.substring(0, sepPos);
	var relativeFilePath = libRelativeFilePath.substring(sepPos + 1, libRelativeFilePath.length);
	var libPath = filePath.replace(new RegExp('(' + libName + ')/.*'), '$1');

	return {filePath: filePath, libName: libName, relativeFilePath: relativeFilePath, libPath: libPath};
}

module.exports = fileInfo;
