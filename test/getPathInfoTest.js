var expect = require('expectations');
var getPathInfo = require('../src/getPathInfo.js');

describe('getPathInfo', function() {
	it('provides valid file information for top-level libraries', function() {
		var pathInfo = getPathInfo('node_modules/the-lib/the-path/module.js');

		expect(pathInfo.libPath).toEqual('node_modules/the-lib');
		expect(pathInfo.libName).toEqual('the-lib');
		expect(pathInfo.relativeFilePath).toEqual('the-path/module.js');
	});

	it('provides valid file information for nested libraries', function() {
		var pathInfo = getPathInfo('node_modules/parent-lib/node_modules/the-lib/the-path/module.js');

		expect(pathInfo.libPath).toEqual('node_modules/parent-lib/node_modules/the-lib');
		expect(pathInfo.libName).toEqual('the-lib');
		expect(pathInfo.relativeFilePath).toEqual('the-path/module.js');
	});

	it('provides valid file information for top-level scoped libraries', function() {
		var pathInfo = getPathInfo('node_modules/@org-name/org-lib/the-path/module.js');

		expect(pathInfo.libPath).toEqual('node_modules/@org-name/org-lib');
		expect(pathInfo.libName).toEqual('@org-name/org-lib');
		expect(pathInfo.relativeFilePath).toEqual('the-path/module.js');
	});

	it('provides valid file information for nested scoped libraries', function() {
		var pathInfo = getPathInfo('node_modules/parent-lib/node_modules/@org-name/org-lib/the-path/module.js');

		expect(pathInfo.libPath).toEqual('node_modules/parent-lib/node_modules/@org-name/org-lib');
		expect(pathInfo.libName).toEqual('@org-name/org-lib');
		expect(pathInfo.relativeFilePath).toEqual('the-path/module.js');
	});
});
