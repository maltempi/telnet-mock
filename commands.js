var fs = require('fs');

var CommandsMock = function (config) {
    this.config = config;
    this.mockCommandsFilesFolder = this.config.mockCommandsFilesFolder;
    this.isCaseSensitive = this.config.os === 'linux';
}

CommandsMock.prototype.exec = function (pCommand) {

    var response = '';
    var self = this;
    var commandToExecute = null;

    // verifies if command exists
    this.config.commandsMock.forEach(function (commandMock) {
        if (commandMock.regex) {
            if (self.matchRegex(pCommand, commandMock.command)) {
                commandToExecute = commandMock;
            }
        } else {
            if (self.matchLiteral(pCommand, commandMock.command)) {
                commandToExecute = commandMock;
            }
        }
    });

    if (commandToExecute) {
        if (commandToExecute.result.type === 'resultInFile') {
            var resultFilePath = this.config.mockCommandsFilesFolder + this.config.path + commandToExecute.result.filePath;
            response = fs.readFileSync(resultFilePath, 'utf8');
        } else { // text
            response = commandToExecute.result.response;
        }
    } else {
        response = this.config.commandNotFoundMessage.message;
    }

    return response;
};

CommandsMock.prototype.matchRegex = function (command, regex) {
    var regex;

    if (this.isCaseSensitive) {
        regex = new RegExp(regex);
    } else {
        regex = new RegExp(regex + '/i');
    }

    return regex.test(command);
};

CommandsMock.prototype.matchLiteral = function (commandSent, commandSetted) {
    if (!this.isCaseSensitive) {
        commandSent = commandSent.toLowerCase();
        commandSetted = commandSetted.toLowerCase();
    }

    return commandSent === commandSetted;
}

module.exports = CommandsMock;