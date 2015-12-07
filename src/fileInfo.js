function fileInfo(filePath) {
	var libRelativeFilePath = filePath.replace(/.*node_modules\//, '');
	var isScopedLib = libRelativeFilePath.startsWith('@');
	var firstSepPos = libRelativeFilePath.indexOf('/');
	var sepPos = (!isScopedLib) ? firstSepPos : libRelativeFilePath.indexOf('/', firstSepPos + 1);
	var libName = libRelativeFilePath.substring(0, sepPos);
	var relativeFilePath = libRelativeFilePath.substring(sepPos + 1, libRelativeFilePath.length);
	var libPath = filePath.replace(new RegExp('(' + libName + ')/.*'), '$1');

	return {filePath: filePath, libName: libName, relativeFilePath: relativeFilePath, libPath: libPath};
}

module.exports = fileInfo;
