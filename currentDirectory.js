var CurrentDirectory = function (config, initialFolder) {
    this.folder = initialFolder;
    this.config = config;
}

CurrentDirectory.prototype.cd = function (pDirectory) {
    pDirectory = pDirectory.replace(/\s*cd\s+/, '');
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
        directory = '';
    }

    folders.forEach(function (folder) {
        if (folder !== '') {
            if (folder === '..') {
                console.log('back one from -> ' + directory);
                directory = self.backOne(directory);
                console.log('->' + directory);
            } else {
                directory += folder + self.config.path;
            }
        }
    });

    this.folder = directory;
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

    if (folder) {
        this.folder = directory.substring(0, indexOfLastSlash + 1);
    }

    return result;
};

module.exports = CurrentDirectory;