var CurrentDirectory = function (config, initialFolder) {
    this.folder = initialFolder;
    this.config = config;
}

CurrentDirectory.prototype.cd = function (pDirectory) {
    this.folder = this.getMountedPath(this.folder, pDirectory);
    return this.folder;
};


CurrentDirectory.prototype.getMountedPath = function (currentPath, pDirectory) {
    pDirectory = pDirectory.replace(/\s*cd\s+/, '');
    pDirectory = pDirectory.replace(/\"/g, '');
    var firstChar = pDirectory.slice(0, 1);
    var threeFirstChars = pDirectory.slice(0, 3);
    var directory = '';
    var self = this;

    if (firstChar === this.config.path || /[A-Z]:\\/.test(threeFirstChars)) {
        directory = pDirectory;
    } else {
        var lastChar = this.folder.slice(-1);

        if (lastChar === this.config.path) {
            directory = this.folder + pDirectory;
        } else {
            directory = this.folder + this.config.path + pDirectory;
        }
    }

    var folders = directory.split(this.config.path);

    // put the init of path on linux case
    if (this.config.os === 'linux') {
        directory = directory.slice(0, 1);
    } else {
        if (directory.slice(0, 1) === this.config.path) {
            directory = this.folder.slice(0, 3);
        } else {
            directory = '';
        }
    }

    folders.forEach(function (folder) {
        if (folder !== '') {
            if (folder === '..') {
                directory = self.backOne(directory);
            } else if (folder === '.') {
                directory += ''; // Does nothing :D
            } else {
                directory += folder + self.config.path;
            }
        }
    });

    directory = this.removeLastSlash(directory)

    return directory;
};

CurrentDirectory.prototype.shouldRemoveLastSlash = function (path) {

    var minPathLen = this.config.os === 'windows' ? 3 : 1;

    if (path.slice(-1) === this.config.path) {
        if (path.length > minPathLen) {
            return true;
        }
    }

    return false;
}


CurrentDirectory.prototype.removeLastSlash = function (path) {
    var result = path;

    if (this.shouldRemoveLastSlash(result)) {
        result = result.substring(0, result.length - 1);
    }


    return result;
}


CurrentDirectory.prototype.pwd = function () {
    return this.folder;
};

CurrentDirectory.prototype.backOne = function (folder) {
    var directory = folder || this.folder;

    if (!this.config.os || !this.config.path) {
        throw new Error('Missed path and/or os configuration.');
    }

    if ('windows' === this.config.os && directory.length === 3 || directory.length === 1) {
        return directory;
    }

    var lastChar = directory.slice(-1);

    if (lastChar === this.config.path) {
        directory = directory.substring(0, directory.length - 2);
    }

    var indexOfLastSlash = directory.lastIndexOf(this.config.path);

    var result = directory.substring(0, indexOfLastSlash + 1);

    result = this.removeLastSlash(result);

    if (!folder) {
        this.folder = result;
    }

    return result;
};

module.exports = CurrentDirectory;