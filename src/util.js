var fs = require('fs');

var Util = function() {}

Util.prototype.fileExists = function(filePath) {
    try {
        fs.accessSync(filePath, fs.F_OK);
        return true;
    } catch (ex) {
        return false;
    }
};

Util.prototype.matchRegex = function(str, regex, isCaseSensitive) {
    var regexExp;

    // Treatment to regex instruction.
    regex = regex.replace(/\{bslash\}/g, '\\\\');

    if (isCaseSensitive) {
        regexExp = new RegExp(regex);
    } else {
        regexExp = new RegExp(regex, 'i');
    }

    return regexExp.test(str);
};

Util.prototype.matchLiteral = function(strA, strB, isCaseSensitive) {
    if (!isCaseSensitive) {
        strA = strA.toLowerCase();
        strB = strB.toLowerCase();
    }

    return strA === strB;
}

module.exports = Util;