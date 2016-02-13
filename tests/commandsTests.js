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
            }, {
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

        // should throw fileNotFound exception
        // should return content file from regex command
        // should return not found on case sensitive
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
                "command": "type /home/maltempi/anywhere/cacildes.txt",
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
            }]
        };

        var cmd = new CommandExec(config);

        it('should return command not found', function () {
            result = cmd.exec('type C:\\somefile.txt');
            assert.equal(result, config.commandNotFoundMessage.message);
        });

        it('should return the result of cat version.txt ', function () {
            result = cmd.exec('type version.txt');
            assert.equal(result, 'V1.0.0');
        });

        it('should return the result of cat cacildes.txt ', function () {
            result = cmd.exec('type /home/maltempi/anywhere/cacildes.txt');
            assert.equal(result.length, 3182);
        });

        // should throw fileNotFound exception
        // should return content file from regex command
        // should return not found on case sensitive
    });

    // TODO: windows happy way
});