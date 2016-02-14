var net = require('net');
var fs = require('fs');
var TelnetServerProtocolStream = require('sol-telnet');
var ConfigModel = require('./configModel');
var Authentication = require('./authentication');
var CurrentDirectory = require('./currentDirectory');
var FolderNotFoundValidator = require('./folderNotFound');
var argv = require('minimist')(process.argv.slice(2));
var CommandsMock = require('./commands');

// Catch params from commandline
var configFilePath = argv.configFile || argv.c;

if (!configFilePath) {
    console.log('FATAL: You must pass a jsonFile with configurations.\n' +
        'See the README on github.com/maltempi/telnet-mock to know how configure it.');
    process.exit();
}

var port = argv.port || argv.p || '3000';

var net = require("net");

var config;

var jsonFs = fs.readFileSync(configFilePath, 'utf8')

config = new ConfigModel(jsonFs);

var configInfo = config.config;

var server = net.createServer(function (sock) {

    this.authentication = new Authentication(configInfo.authentication);

    this.currentDirectory = new CurrentDirectory(configInfo);

    this.commandsMock = new CommandsMock(configInfo);

    this.lastInformationSent = '';

    var self = this;

    var ts = new TelnetServerProtocolStream();

    sock.pipe(ts).pipe(sock);

    // Every time you get a NULL LF you get a line. 
    ts.on('lineReceived', function (line) {
        console.log('Command Received ->' + line);

        if (self.authentication.isAuthenticated) {
            response = self.executeCommand(line);
            self.sendToClient(response);
        } else {
            self.authenticationUI(line);
        }
    });

    ts.on('clientWindowChangedSize', function (width, height) {
        if (!self.lastInformationSent) {
            self.sendToClient(configInfo.helloMessage.message);
            self.authenticationUI();
        }
    });

    // Something odd...
    ts.on('unhandledCommand', function (data) {
        console.log('unhandledCommand -> ' + data);

        // No negotiate About Window Size
        if (data.command === 252 && data.option === 31) {
            if (!self.lastInformationSent) {
                self.sendToClient(configInfo.helloMessage.message);
                self.authenticationUI();
            }
        }
    });

    this.executeCommand = function (commandSent) {

        var commandResult = this.commandsMock.exec(commandSent);

        if (commandResult.indexOf(configInfo.commandNotFoundMessage.message) === -1) {
            return commandResult;
        }

        if (! new FolderNotFoundValidator(configInfo, commandSent).isExist) {
            return configInfo.folderNotFoundMessage.message;
        }

        if (commandSent.indexOf('cd ') > -1) {
            this.currentDirectory.cd(commandSent);
            return '';
        }

        if (/^pwd\s*/.test(commandSent)) {
            return this.currentDirectory.pwd();
        }

        return 'nothing';
    };

    this.authenticationUI = function (message) {
        var authConfig = configInfo.authentication;

        if (this.lastInformationSent.indexOf(authConfig.askForUserMessage) > -1) {
            this.user = message;
            this.sendToClient(authConfig.askForPasswdMessage);
            return;
        } else if (this.lastInformationSent.indexOf(authConfig.askForPasswdMessage) > -1) {
            this.password = message;
            var authMessage = this.authentication.authenticateHighLevelMessage(this.user, this.password)
            self.currentDirectory.folder = self.authentication.initialFolder;
            this.sendToClient(authMessage); // do authentication here
        } else {
            this.sendToClient(authConfig.askForUserMessage);
            return;
        }
    }

    this.sendToClient = function (message) {
        self.lastInformationSent = message;

        if (self.currentDirectory.folder) {
            message += '\n' + self.currentDirectory.folder + '>' /* TODO: end of file be a config */ ;
        }

        console.log('Message sent -> ' + message);

        ts.send(message);
    };

    if (!self.lastInformationSent) {
        self.sendToClient(configInfo.helloMessage.message);
        self.authenticationUI();
    }
});

server.listen(port);

console.log('The server is up! Listening on ' + port);