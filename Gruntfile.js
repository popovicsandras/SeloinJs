'use strict';

module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // Project settings
        pkg: grunt.file.readJSON('package.json'),
        config: {
            // Configurable paths
            app: 'lib',
            dist: 'dist'
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'lib/{,**/}*.js',
                'test/{,**/}*.js'
            ]
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running test (defaults to false)
                    require: [
                        'test/setup.js'
                    ]
                },
                src: ['test/spec/**/*.js']
            }
        }
    });

    grunt.registerTask('default', [
        'jshint',
        'mochaTest'
    ]);
};