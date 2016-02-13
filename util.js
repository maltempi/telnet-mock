var fs = require('fs');

var Util = function () {}

Util.prototype.fileExists = function(filePath) {
	try {
		fs.accessSync(filePath, fs.F_OK);
		return true;
	} catch (ex) {
		return false;
	}
};

module.exports = Util;