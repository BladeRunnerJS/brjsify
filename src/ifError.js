function ifError(callback) {
	return function(error) {
		if(error) {
			callback(error);
		}
	}
}

module.exports = ifError;
