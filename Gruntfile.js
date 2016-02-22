/*
 * websquare-lint
 * https://github.com/inswave/websquare-lint
 *
 * Copyright (c) 2013 inswave
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: {
            tests: ['tmp', 'result'],
            traverse: ['dest', 'result']
        },
        websquarelint: {
            compile: {
				options: {
					configFile: 'conf/eslint.json',
					rulePaths: ['conf/rules']
				},
                files: {
                    'tmp/sample.xml': ['test/sample.xml']
                },
                results:'result/result.txt'
            },
            compile_spa: {
				options: {
					configFile: 'conf/eslint_spa.json',
					rulePaths: ['conf/rules']
				},
                files: {
                    'tmp/sample.xml': ['test/sample.xml']
                },
                results:'result/result.txt'
            },
            traverse: {
				options: {
					configFile: 'conf/eslint.json',
					rulePaths: ['conf/rules']
				},
                files: [
                    {expand: true, cwd: 'src/', src: ['**'], dest: 'dest/'}
                ],
                result:'result/result.txt'
            },
            traverse_spa: {
				options: {
					configFile: 'conf/eslint_spa.json',
					rulePaths: ['conf/rules']
				},
                files: [
                    {expand: true, cwd: 'src/', src: ['**'], dest: 'dest/'}
                ],
                result:'result/result.txt'
            },
        }
    });

    grunt.loadTasks('tasks');
    grunt.registerTask('test', ['clean:tests', 'websquarelint:compile']);
    grunt.registerTask('traverse', ['clean:traverse', 'websquarelint:traverse']);
    grunt.registerTask('test_spa', ['clean:tests', 'websquarelint:compile_spa']);
    grunt.registerTask('traverse_spa', ['clean:traverse', 'websquarelint:traverse_spa']);
    grunt.registerTask('default', ['traverse']);
};
