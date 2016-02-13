var assert = require('assert');

var CommandExec = require('../commands');

describe('Exec commands: text type', function () {
    describe('Linux happy way', function () {
        var config = {
            path: '/',
            os: 'linux',
            "mockCommandsFilesFolder": __dirname + "/mockCommandsFilesFolderTest",
            "commandNotFoundMessage": {
                "message": "command not found"
            },
            "commandsMock": [{
                "command": "cat version.txt",
                "result": {
                    "type": "text",
                    "response": "V1.0.0"
                }
            }, {
                "command": "cat /home/maltempi/anywhere/cacildes.txt",
                "result": {
                    "type": "resultInFile",
                    "filePath": "cacildes.txt"
                }
            }, 
            {
                "command": "cat cacildes2.txt",
                "result": {
                    "type": "resultInFile",
                    "filePath": "2.txt"
                }
            },{
                "command": "touch /home/maltempi/d+.csv",
                "regex": true,
                "result": {
                    "type": "text",
                    "response": ""
                }
            }]
        };

        var cmd = new CommandExec(config);

        it('should return command not found', function () {
            result = cmd.exec('cat /home/maltempi/somefile.txt');
            assert.equal(result, config.commandNotFoundMessage.message);
        });

        it('should return the result of cat version.txt ', function () {
            result = cmd.exec('cat version.txt');
            assert.equal(result, 'V1.0.0');
        });

        it('should return the result of cat cacildes.txt ', function () {
            result = cmd.exec('cat /home/maltempi/anywhere/cacildes.txt');
            assert.equal(result.length, 3182);
        });

        it('should not found on case sensitive (on regex case)', function () {
            result = cmd.exec('Cat /home/maltempi/anywhere/cacildes.txt');
            assert.equal(result, config.commandNotFoundMessage.message);
        });

        it('should not found on case sensitive (on literal case)', function () {
            result = cmd.exec('cat Version.txt');
            assert.equal(result, config.commandNotFoundMessage.message);
        });

        it('should fileNotFound message', function() {
            result = cmd.exec('cat cacildes2.txt');
            file = config.mockCommandsFilesFolder + "/2.txt"
            assert.equal(result, 'Telnet Mock exception: The file ' + file + ' does not exists!');
        });
        // should return content file from regex command
    });

    describe('Windows happy way', function () {
        var config = {
            path: '\\',
            os: 'windows',
            "mockCommandsFilesFolder": __dirname + "/mockCommandsFilesFolderTest",
            "commandNotFoundMessage": {
                "message": "command not found"
            },
            "commandsMock": [{
                "command": "type version.txt",
                "result": {
                    "type": "text",
                    "response": "V1.0.0"
                }
            }, {
                "command": "type c:\\anywhere\\cacildes.txt",
                "result": {
                    "type": "resultInFile",
                    "filePath": "cacildes.txt"
                }
            }, {
                "command": 'find /c /v "" /home/maltempi/d+.csv',
                "regex": true,
                "result": {
                    "type": "text",
                    "response": ""
                }
            },
            {
                "command": "type cacildes2.txt",
                "result": {
                    "type": "resultInFile",
                    "filePath": "2.txt"
                }
            }]
        };

        var cmd = new CommandExec(config);

        it('should return command not found', function () {
            result = cmd.exec('type C:\\somefile.txt');
            assert.equal(result, config.commandNotFoundMessage.message);
        });

        it('should return the result of cat version.txt (incluiding case sensitive case) ', function () {
            result = cmd.exec('type Version.txt');
            assert.equal(result, 'V1.0.0');
        });

        it('should return the result of cat cacildes.txt ', function () {
            result = cmd.exec('type c:\\anywhere\\cacildes.txt');
            assert.equal(result.length, 3182);
        });

        it('should fileNotFound message', function() {
            result = cmd.exec('type cacildes2.txt');
            file = config.mockCommandsFilesFolder + "/2.txt"
            assert.equal(result, 'Telnet Mock exception: The file ' + file + ' does not exists!');
        });

        // should return content file from regex command
    });

    // TODO: windows happy way
});