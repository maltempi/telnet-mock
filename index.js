var net = require('net');
var fs = require('fs');
var TelnetServerProtocolStream = require('sol-telnet');
var ConfigModel = require('./configModel');
var Authentication = require('./authentication');

var net = require("net");

var config;

// TODO: get from commandline
var jsonFs = fs.readFileSync('/home/maltempi/workspace/estudos/telnet-mock/config.json', 'utf8')

config = new ConfigModel(jsonFs);

var configInfo = config.config;

var server = net.createServer(function (sock) {

    this.authentication = new Authentication(configInfo.authentication);

    this.lastInformationSent = '';

    var self = this;

    var ts = new TelnetServerProtocolStream();

    sock.pipe(ts).pipe(sock);

    // Every time you get a NULL LF you get a line. 
    ts.on('lineReceived', function (line) {
        console.log(line);

        if (self.authentication.isAuthenticated) {
            self.sendToClient('Response to: ' + line + '\n');
        } else {
            if (!self.lastInformationSent) {
                self.sendToClient(configInfo.helloMessage.message);
            }

            self.authenticationUI(line);
        }
    });

    ts.on('clientWindowChangedSize', function (width, height) {
    });

    // Something odd...
    ts.on("unhandledCommand", function (data) {
        console.log(data);
    });

    this.authenticationUI = function (message) {
        var authConfig = configInfo.authentication;

        if (this.lastInformationSent.indexOf(authConfig.askForUserMessage) > -1) {
            this.user = message;
            this.sendToClient(authConfig.askForPasswdMessage);
            return;
        } else if (this.lastInformationSent.indexOf(authConfig.askForPasswdMessage) > -1) {
            this.password = message;
            this.sendToClient(this.authentication.authenticateHighLevelMessage(this.user, this.password)); // do authentication here
        } else {
            this.sendToClient(authConfig.askForUserMessage);
            return;
        }
    }

    this.sendToClient = function (message) {
        self.lastInformationSent = message;
        ts.send(message);
    }

})

// TODO: get from commandline
server.listen(3000);

console.log('The server is up! Listening on localhost:3000');