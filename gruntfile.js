module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		
		yuidoc: {
			compile: {
				name: "<%= pkg.name %>",
				description: "<%= pkg.description %>",
				version: "<%= pkg.version %>",
				url: "<%= pkg.homepage %>",
				options: {
					extension: ".js",
					paths: "src/",
					outdir: "docs/"
				}
			}
		},

		uglify: {
			build: {
				files: {
					"<%= pkg.filenameBase %>-<%= pkg.version %>.min.js":
						["<%= pkg.main %>*.js"]
				}
			}
		},
 
		concat: {
			build: {
				src:["src/*"],
				dest: "<%= pkg.filenameBase %>-<%= pkg.version %>.js"
			}
		},
		
		connect: {
			server: {
				options: {
					port: 9000,
					base: "./"
				}
			}
		},

		jshint: {
			src: "src/**/*.js",
			options: {
				camelcase: true,
				curly: true,
				eqeqeq: true,
				eqnull: true,
				newcap: true,
				quotmark: "double"
			}
		}
 });

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-yuidoc");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	
	grunt.registerTask("default", [
		"jshint",
		"uglify:build",
		"concat:build"
		]);
	
	grunt.registerTask("full", [
		"jshint",
		"concat:build",
		"uglify:build",
		"yuidoc:compile"
		]);

	grunt.registerTask("serve", [
		"connect:server:keepalive"
		]);
};
