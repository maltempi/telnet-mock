var fs = require('fs');
var Util = require('./util');

var CommandsMock = function(globalConfig, commandsConfig) {
    this.config = globalConfig;
    this.commandsConfig = commandsConfig || this.config.commandsMock;
    this.mockCommandsFilesFolder = this.config.mockCommandsFilesFolder;
    this.isCaseSensitive = this.config.os === 'linux';
    this.util = new Util();
}

CommandsMock.prototype.exec = function(pCommand) {

    var response = '';
    var self = this;
    var commandToExecute = null;

    // verifies if command exists
    this.commandsConfig.forEach(function(commandMock) {
        var match = null;

        if (commandMock.regex) {
            match = self.util.matchRegex(pCommand, commandMock.command, self.isCaseSensitive);
        } else {
            match = self.util.matchLiteral(pCommand, commandMock.command, self.isCaseSensitive);
        }

        if (match) {
            commandToExecute = commandMock;
        }
    });

    if (commandToExecute) {
        if (commandToExecute.result.type === 'resultInFile') {
            var resultFilePath = this.config.mockCommandsFilesFolder + '/' + commandToExecute.result.filePath;

            if (new Util().fileExists(resultFilePath)) {
                response = fs.readFileSync(resultFilePath, 'utf8');
            } else {
                response = 'Telnet Mock exception: The file ' + resultFilePath + ' does not exists!';
            }
        } else { // text
            response = commandToExecute.result.response;
        }
    } else {
        response = this.config.commandNotFoundMessage.message;
    }

    return response;
};

module.exports = CommandsMock;