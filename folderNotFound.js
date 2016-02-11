var FolderNotFoundValidator = function (config, folderPath) {
    this.folderPath = folderPath;
    this.config = config;
    this.isExist = false;

    if (this.folderPath) {
        this.isExist = this.exists(this.folderPath);
        this.notFoundMessage = config.folderNotFoundMessage;
    }
};

/**
    TODO A ugly method. Im really want refactory that :D
*/
FolderNotFoundValidator.prototype.exists = function (folderPath) {
    var exists = true;
    var matches = null;
    var self = this;
    var folders = [];

    if (this.config.os === 'windows') {
        // gets all folders with spaces (they must inside ")
        matches = /\".*\"/.exec(folderPath);

        if (matches) {
            matches.forEach(function (match) {
                folders.push(match.replace(/\"/g, ""));
                folderPath = folderPath.replace(match, '');
            });
        }
    } else {
        matches = /[\s*\/].*\s.*(\s+|$)/.exec(folderPath);
        if (matches) {
            matches.forEach(function (match) {
                folders.push(match);
                folderPath = folderPath.replace(match, '');
            });
        }
    }

    // now on folderPath, we only have folders without spaces.
    // why people put space on directories names? :(
    var token = folderPath.split(' ');

    token.forEach(function (folder, index) {
        if (folder.indexOf(self.config.path) > -1) {
            console.log('pushing ' + folder);
            folders.push(folder);
        }
    });

    console.log(folders);

    this.config.foldersNotFound.forEach(function (folderNotFound) {

        if (self.config.os === 'windows') { // Windows isnt case sensitive
            folderNotFound = folderNotFound.toLowerCase();
        }

        folders.forEach(function (aFolder) {

            if (aFolder.substring(0, 1) === '\\') {
                aFolder = 'c:' + aFolder;
            }

            if (self.config.os === 'windows') {
                aFolder = aFolder.toLowerCase();
            }

            if (aFolder.slice(-1) !== self.config.path) {
                aFolder += self.config.path;
            }

            if (aFolder.indexOf(folderNotFound) > -1) {
                exists = false;
                return;
            }
        });
    });

    return exists;
};


module.exports = FolderNotFoundValidator;