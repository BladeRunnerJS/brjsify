var expect = require('expectations');
var legacyFilePath = require('../src/legacyFilePath.js');

describe('legacyFilePath', function() {
  it('removes the need for /modules/ in require paths', function() {
    var path = 'node_modules/the-lib/modules/the-path/modules.js';
    expect(legacyFilePath(path)).toEqual('node_modules/the-lib/the-path/modules.js');
	});

  // it('allows @org-name to be referred to as org-name', function() {
  //   var path = 'node_modules/@org-name/org-lib/the-path/modules.js';
  //   expect(legacyFilePath(path)).toEqual('node_modules/%org-name/org-lib/the-path/modules.js');
	// });

	it('allows @brjs to be referred to as @br', function() {
    var path = 'node_modules/@brjs/org-lib/the-path/modules.js';
    expect(legacyFilePath(path)).toEqual('node_modules/@br/org-lib/the-path/modules.js');
	});
});
