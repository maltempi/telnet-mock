module.exports = function (grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt',
                    quiet: false,
                    clearRequireCache: false
                },
                src: ['tests/**/*.js']
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-mocha-test');

    // Default tasks
    grunt.registerTask('test', 'mochaTest');

};