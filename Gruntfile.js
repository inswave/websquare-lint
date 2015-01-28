'use strict';
module.exports = function (grunt) {
	grunt.initConfig({
		websquarelint: {
			options: {
				configFile: 'conf/eslint.json',
				rulePaths: ['conf/rules']
			},
//			validate: ['test/fixture/{1,2,3}.js']
			validate: ['dest/**/*.js']
		},
		shell: {
			websquarelint: {
				command: 'grunt websquarelint',
				options: {
					callback: function (err, stdout, stderr, cb) {
						if (/test\/fixture\/1\.js/.test(stdout)) {
							if (!/camelcase/.test(stdout)) {
								cb();
							} else {
								cb(false);
							}
						} else {
							cb(false);
						}
					}
				}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-shell');
	grunt.registerTask('default', ['shell:websquarelint']);
};
