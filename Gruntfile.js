module.exports = function(grunt) {
    "use strict";

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'js/app.js': 'js/script.js'
                }
            }
        },
        uglify: {
            my_target: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'js/app.js.map'
                },
                files: {
                    'js/app.min.js': ['js/app.js']
                }
            }
        },
        jshint: {
            options: {
                esversion: 6
            },
            src: ['js/script.js']
        }
    });

    grunt.registerTask('default', ['jshint', 'babel', 'uglify']);
    
};