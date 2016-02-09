var net = require('net');
var fs = require('fs');
var TelnetServerProtocolStream = require('sol-telnet');
var ConfigModel = require('./configModel');
var Authentication = require('./authentication');
var CurrentDirectory = require('./currentDirectory');
var argv = require('minimist')(process.argv.slice(2));

// Catch params from commandline
var configFilePath = argv.configFile || argv.c || './config.json';
var port = argv.port || argv.p || '3000';

var net = require("net");

var config;

var jsonFs = fs.readFileSync(configFilePath, 'utf8')

config = new ConfigModel(jsonFs);

var configInfo = config.config;

var server = net.createServer(function (sock) {

    this.authentication = new Authentication(configInfo.authentication);

    this.currentDirectory = new CurrentDirectory(configInfo);

    this.lastInformationSent = '';

    var self = this;

    var ts = new TelnetServerProtocolStream();

    sock.pipe(ts).pipe(sock);

    // Every time you get a NULL LF you get a line. 
    ts.on('lineReceived', function (line) {
        console.log(line);

        if (self.authentication.isAuthenticated) {
            response = self.executeCommand(line);
            response += '\n' + self.currentDirectory.folder + '>' /* TODO: end of file be a config */ ;
            self.sendToClient(response);
        } else {
            self.authenticationUI(line);
        }
    });

    ts.on('clientWindowChangedSize', function (width, height) {
        if (!self.lastInformationSent) {
            self.sendToClient(configInfo.helloMessage.message);
        }
    });

    // Something odd...
    ts.on("unhandledCommand", function (data) {
        console.log('unhandledCommand -> ' + data);

        // No negotiate About Window Size
        if (data.command === 252 && data.option === 31) {
            if (!self.lastInformationSent) {
                self.sendToClient(configInfo.helloMessage.message);
            }
        }
    });

    this.executeCommand = function (commandSent) {
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
            this.sendToClient(this.authentication.authenticateHighLevelMessage(this.user, this.password)); // do authentication here
            this.currentDirectory.folder = this.authentication.initialFolder;
        } else {
            this.sendToClient(authConfig.askForUserMessage);
            return;
        }
    }

    this.sendToClient = function (message) {
        self.lastInformationSent = message;
        console.log(message);
        ts.send(message);
    }

})

server.listen(port);

console.log('The server is up! Listening on ' + port);