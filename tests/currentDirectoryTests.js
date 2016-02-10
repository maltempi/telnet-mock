var assert = require('assert');

var CurrentDirectory = require('../currentDirectory');

describe('CD Path', function () {

    describe('Linux happy way', function () {
        var config = {
            path: '/',
            os: 'linux'
        };

        it('/home/maltempi to /etc/init.d/', function () {
            var currentDirectory = new CurrentDirectory(config, '/home/maltempi/');
            currentDirectory.cd('cd /etc/init.d/');
            assert.equal(currentDirectory.pwd(), '/etc/init.d');
        });
    });

    describe('Windows happy way', function () {
        var config = {
            path: '\\',
            os: 'windows'
        };

        it('C:\\Program Files\\ to C:\\users\\maltempi', function () {
            var currentDirectory = new CurrentDirectory(config, 'C:\\Program Files\\');
            currentDirectory.cd('cd C:\\users\\maltempi\\');
            assert.equal(currentDirectory.pwd(), 'C:\\users\\maltempi');
        });
    });

    describe('Windows chaotic scenarios', function () {
        var config = {
            path: '\\',
            os: 'windows'
        };

        it('Many .. on the path', function () {
            var currentDirectory = new CurrentDirectory(config, 'C:\\maltemper');
            currentDirectory.cd('cd C:\\Program Files\\..\\temp\\abc\\..\\..\\Program Files\\');
            assert.equal(currentDirectory.pwd(), 'C:\\Program Files');
        });

        it('With slash on begin of the path', function () {
            var currentDirectory = new CurrentDirectory(config, 'C:\\maltemper');
            currentDirectory.cd('cd \\Program Files\\..\\temp\\abc\\..\\..\\Program Files\\');
            assert.equal(currentDirectory.pwd(), 'C:\\Program Files');
        });


        it('With slash on begin of the path, but on D:\\ drive', function () {
            var currentDirectory = new CurrentDirectory(config, 'D:\\maltemper');
            currentDirectory.cd('cd \\Program Files\\..\\temp\\abc\\..\\..\\Program Files\\');
            assert.equal(currentDirectory.pwd(), 'D:\\Program Files');
        });
    });
});


describe('Backing just one directory', function () {

    describe('Linux happy way', function () {
        var config = {
            path: '/',
            os: 'linux'
        };
        var currentDirectory = new CurrentDirectory(config, '/home/maltempi/');

        it('/home/maltempi -> should back one', function () {
            currentDirectory.backOne();
            assert.equal(currentDirectory.pwd(), '/home');
        });

        it('/home/ -> should back to root folder', function () {
            currentDirectory.backOne();
            assert.equal(currentDirectory.pwd(), '/');
        });

        it('/ -> should do nothing', function () {
            currentDirectory.backOne();
            assert.equal(currentDirectory.pwd(), '/');
        });
    });

    describe('Windows happy way', function () {
        var config = {
            path: '\\',
            os: 'windows'
        };
        var currentDirectory = new CurrentDirectory(config, 'C:\\users\\maltempi\\');

        it('c:\\users\\maltempi\\ -> should back one', function () {
            currentDirectory.backOne();
            assert.equal(currentDirectory.pwd(), 'C:\\users');
        });

        it('c:\\users\\ -> should back to root folder', function () {
            currentDirectory.backOne();
            assert.equal(currentDirectory.pwd(), 'C:\\');
        });

        it('c:\\ -> should do nothing', function () {
            currentDirectory.backOne();
            assert.equal(currentDirectory.pwd(), 'C:\\');
        });
    });

    describe('Linux no last slash', function () {
        var config = {
            path: '/',
            os: 'linux'
        };

        var currentDirectory = new CurrentDirectory(config, '/home/maltempi');

        it('/home/maltempi -> should back one', function () {
            currentDirectory.backOne();
            assert.equal(currentDirectory.pwd(), '/home');
        });
    });

    describe('Windows no last slash', function () {
        var config = {
            path: '\\',
            os: 'windows'
        };
        var currentDirectory = new CurrentDirectory(config, 'C:\\users\\maltempi');

        it('c:\\users\\maltempi -> should back one', function () {
            currentDirectory.backOne();
            assert.equal(currentDirectory.pwd(), 'C:\\users');
        });
    });


    describe('No Configuration path', function () {
        var config = {
            os: 'linux'
        };

        var currentDirectory = new CurrentDirectory(config, '/home/maltempi/');

        it('should throw exception', function () {
            assert.throws(function () {
                currentDirectory.backOne();
            }, function (err) {
                return err.message === 'Missed path and/or os configuration.';
            });
        });
    });

    describe('No Configuration os', function () {
        var config = {
            path: '/'
        };

        var currentDirectory = new CurrentDirectory(config, '/home/maltempi');

        it('should throw exception', function () {
            assert.throws(function () {
                currentDirectory.backOne();
            }, function (err) {
                return err.message === 'Missed path and/or os configuration.';
            });
        });
    });
});