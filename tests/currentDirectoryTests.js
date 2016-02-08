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
            assert.equal(currentDirectory.folder, '/etc/init.d/');
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
            assert.equal(currentDirectory.folder, 'C:\\users\\maltempi\\');
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
            assert.equal(currentDirectory.folder, '/home/');
        });

        it('/home/ -> should back to root folder', function () {
            currentDirectory.backOne();
            assert.equal(currentDirectory.folder, '/');
        });

        it('/ -> should do nothing', function () {
            currentDirectory.backOne();
            assert.equal(currentDirectory.folder, '/');
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
            assert.equal(currentDirectory.folder, 'C:\\users\\');
        });

        it('c:\\users\\ -> should back to root folder', function () {
            currentDirectory.backOne();
            assert.equal(currentDirectory.folder, 'C:\\');
        });

        it('c:\\ -> should do nothing', function () {
            currentDirectory.backOne();
            assert.equal(currentDirectory.folder, 'C:\\');
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
            assert.equal(currentDirectory.folder, '/home/');
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
            assert.equal(currentDirectory.folder, 'C:\\users\\');
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

        var currentDirectory = new CurrentDirectory(config, '/home/maltempi/');

        it('should throw exception', function () {
            assert.throws(function () {
                currentDirectory.backOne();
            }, function (err) {
                return err.message === 'Missed path and/or os configuration.';
            });
        });
    });
});