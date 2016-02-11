var assert = require('assert');

var FolderNotFoundValidator = require('../folderNotFound');

describe('Folder exists', function () {

    describe('The happy way', function () {
        var config = {
            path: '\\',
            os: 'windows',
            foldersNotFound: [
                'c:\\program files\\'
            ],
            folderNotFoundMessage: {
                "message": "Not Found"
            }
        };

        it('should return true', function () {
            var folderValidator = new FolderNotFoundValidator(config, 'c:\\');
            assert.equal(folderValidator.isExist, true);
        });

        it('should return false', function () {
            var folderValidator = new FolderNotFoundValidator(config, '"c:\\program files\\"');
            assert.equal(folderValidator.isExist, false);
        });
    });


    describe('Windows with slash on start', function () {
        var config = {
            path: '\\',
            os: 'windows',
            foldersNotFound: [
                'c:\\program files\\'
            ],
            folderNotFoundMessage: {
                "message": "Not Found"
            }
        };

        it('should return true', function () {
            var folderValidator = new FolderNotFoundValidator(config, '\\existentFolder\\');
            assert.equal(folderValidator.isExist, true);
        });

        it('should return false', function () {
            var folderValidator = new FolderNotFoundValidator(config, '"\\program files\\"');
            assert.equal(folderValidator.isExist, false);
        });
    });


    describe('Wihout slash in the end - input', function () {
        var config = {
            path: '\\',
            os: 'windows',
            foldersNotFound: [
                'c:\\program files'
            ],
            folderNotFoundMessage: {
                "message": "Not Found"
            }
        };

        it('should return true', function () {
            var folderValidator = new FolderNotFoundValidator(config, 'c:\\existentFolder\\');
            assert.equal(folderValidator.isExist, true);
        });

        it('should return false', function () {
            var folderValidator = new FolderNotFoundValidator(config, '"c:\\program files\\"');
            assert.equal(folderValidator.isExist, false);
        });
    });


    describe('Without slash in the end - response', function () {
        var config = {
            path: '\\',
            os: 'windows',
            foldersNotFound: [
                'c:\\program files\\'
            ],
            folderNotFoundMessage: {
                "message": "Not Found"
            }
        };

        it('should return true', function () {
            var folderValidator = new FolderNotFoundValidator(config, 'c:\\existentFolder');
            assert.equal(folderValidator.isExist, true);
        });

        it('should return false', function () {
            var folderValidator = new FolderNotFoundValidator(config, '"c:\\program files"');
            assert.equal(folderValidator.isExist, false);
        });
    });


    describe('Case sensitive - Windows', function () {
        var config = {
            path: '\\',
            os: 'windows',
            foldersNotFound: [
                'c:\\program files\\'
            ],
            folderNotFoundMessage: {
                "message": "Not Found"
            }
        };

        it('should return false', function () {
            var folderValidator = new FolderNotFoundValidator(config, '"C:\\Program Files"');
            assert.equal(folderValidator.isExist, false);
        });
    });


    describe('Case sensitive - Linux', function () {
        var config = {
            path: '/',
            os: 'linux',
            foldersNotFound: [
                '/dev/program files/'
            ],
            folderNotFoundMessage: {
                "message": "Not Found"
            }
        };

        it('should return true', function () {
            var folderValidator = new FolderNotFoundValidator(config, '/dev/program Files/');
            assert.equal(folderValidator.isExist, true);
        });

        it('should return false', function () {
            var folderValidator = new FolderNotFoundValidator(config, '/dev/program files/');
            assert.equal(folderValidator.isExist, false);
        });
    });


    describe('With some commands', function () {
        var config = {
            path: '\\',
            os: 'windows',
            foldersNotFound: [
                'c:\\program files\\'
            ],
            folderNotFoundMessage: {
                "message": "Not Found"
            }
        };

        it('should return true', function () {
            var folderValidator = new FolderNotFoundValidator(config, 'Dir \\usr\\tmp\\test /t:w');
            assert.equal(folderValidator.isExist, true);
        });

        it('should return false', function () {
            var folderValidator = new FolderNotFoundValidator(config, 'Dir "c:\\program files\\test" /t:w');
            assert.equal(folderValidator.isExist, false);
        });

        it('should return ', function () {
            var folderValidator = new FolderNotFoundValidator(config, 'Dir "\\program files\\test" /t:w');
            assert.equal(folderValidator.isExist, false);
        });

    });
});