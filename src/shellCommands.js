var Util = require('./util');
var CommandsMock = require('./commands');

var ShellCommands = function (config) {
    this.config = config;
    this.shellsConfig = config.shells || [];
    this.selectedShell = null;
    this.util = new Util();
    this.isCaseSensitive = this.config.os === 'linux';
}

ShellCommands.prototype.isOnShell = function () {
    return this.selectedShell !== null;
};

ShellCommands.prototype.enterShell = function (pCommand) {
    var self = this;

    this.shellsConfig.forEach(function (shellConfig) {
        var match = self.util.matchLiteral(pCommand, shellConfig.command, self.isCaseSensitive);

        if (match) {
            self.selectedShell = shellConfig;
            self.commandsMock = new CommandsMock(self.config, self.selectedShell.shellCommands);
        }
    });

    return this.isOnShell();
};

ShellCommands.prototype.exec = function(command) {
    if (!this.selectedShell) {
        return 'no shell selected';
    }

    var result = this.commandsMock.exec(command);
    
    if (result === this.config.commandNotFoundMessage.message) {
        var match = this.util.matchLiteral(command, this.selectedShell.commandToExit, this.isCaseSensitive);

        if (match) {
            result = 'exit';
            this.selectedShell = null;
        } else {
            result = this.selectedShell.commandNotFoundMessage.message;
        }
    }
    
    return result;
};

module.exports = ShellCommands;