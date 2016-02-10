var FolderNotFoundValidator = function (config, folderPath) {
    this.folderPath = folderPath;
    this.config = config;
    this.isExist = false;

    if (this.folderPath) {
        this.isExist = this.exists(this.folderPath);
        this.notFoundMessage = config.folderNotFoundMessage;
    }
};


FolderNotFoundValidator.prototype.exists = function (folderPath) {
    var exists = true;
    folderPath = folderPath.toLowerCase();

    this.config.foldersNotFound.forEach(function (folderNotFound) {
        folderNotFound = folderNotFound.toLowerCase();

        if (folderNotFound.indexOf(folderPath) > -1 || folderPath.indexOf(folderNotFound) > -1) {
            exists = false;
            return;
        }
    });

    return exists;
};


module.exports = FolderNotFoundValidator;