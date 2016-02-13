var fs = require('fs');

var CommandsMock = function (config) {
    this.config = config;
    this.mockCommandsFilesFolder = this.config.mockCommandsFilesFolder;
}

CommandsMock.prototype.exec = function (pCommand) {

    var response = '';

    var commandToExecute = null;

    // verifies if command exists
    this.config.commandsMock.forEach(function (commandMock) {

        var commandFound = false;

        if (commandMock.regex) {
            var regex = new RegExp(commandMock.command);

            if (regex.test(pCommand)) {
                commandToExecute = commandMock;
            }
        } else {
        	if (pCommand === commandMock.command) {
            	commandToExecute = commandMock;
            }
        }

        if (commandToExecute) {
            return false;
        }
    });

    if (commandToExecute) {
        if (commandToExecute.result.type === 'resultInFile') {
            var resultFilePath = this.config.mockCommandsFilesFolder 
            				+ this.config.path 
            				+ commandToExecute.result.filePath;
            response = fs.readFileSync(resultFilePath, 'utf8');
        } else { // text
            response = commandToExecute.result.response;
        }
    } else {
        response = this.config.commandNotFoundMessage.message;
    }

    return response;
};

module.exports = CommandsMock;