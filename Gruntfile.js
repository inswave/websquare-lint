/*
 * websquare-min
 * https://github.com/inswave/websquare-min
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
        copy: {
            main: {
                files: [
                    {expand: true, src: ['src/**'], dest: 'dest/'}
                ]
            },
            cwd: {
                files: [
                    {expand: true, cwd: 'src/', src: ['**'], dest: 'dest/'}
                ]
            }
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
            options: {
//                jshintrc : true
                jshintrc: 'jshintrc_spa'
            }
        }
    });

    grunt.loadTasks('tasks');
    grunt.registerTask('test', ['clean:tests', 'websquarelint:compile']);
    grunt.registerTask('traverse', ['clean:traverse', 'websquarelint:traverse']);
    grunt.registerTask('default', ['test']);
};
