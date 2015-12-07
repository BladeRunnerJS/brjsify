var expect = require('expectations');
var fileInfo = require('../src/fileInfo.js');

describe('fileInfo', function() {
	it('provides valid file information for top-level libraries', function() {
		var info = fileInfo('node_modules/the-lib/the-path/module.js');

		expect(info.libPath).toEqual('node_modules/the-lib');
		expect(info.libName).toEqual('the-lib');
		expect(info.relativeFilePath).toEqual('the-path/module.js');
	});

	it('provides valid file information for nested libraries', function() {
		var info = fileInfo('node_modules/parent-lib/node_modules/the-lib/the-path/module.js');

		expect(info.libPath).toEqual('node_modules/parent-lib/node_modules/the-lib');
		expect(info.libName).toEqual('the-lib');
		expect(info.relativeFilePath).toEqual('the-path/module.js');
	});

	it('provides valid file information for top-level scoped libraries', function() {
		var info = fileInfo('node_modules/@org-name/org-lib/the-path/module.js');

		expect(info.libPath).toEqual('node_modules/@org-name/org-lib');
		expect(info.libName).toEqual('@org-name/org-lib');
		expect(info.relativeFilePath).toEqual('the-path/module.js');
	});

	it('provides valid file information for nested scoped libraries', function() {
		var info = fileInfo('node_modules/parent-lib/node_modules/@org-name/org-lib/the-path/module.js');

		expect(info.libPath).toEqual('node_modules/parent-lib/node_modules/@org-name/org-lib');
		expect(info.libName).toEqual('@org-name/org-lib');
		expect(info.relativeFilePath).toEqual('the-path/module.js');
	});
});
