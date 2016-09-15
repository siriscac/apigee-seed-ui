/**
 * Created by siriscac on 19/08/16.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {

        },
        grunt: {},
        shell: {
            client:{
                command:"npm run client"
            },
            clientprod:{
                command:"npm run client-prod"
            },
            clienttest:{
                command:"npm run client-test"
            },
            options: {
                stderr: false
            }
        },
        copy: {
            configdev: {
                src: 'client/config/config.dev.ts',
                dest: 'client/config/config.ts'
            },
            configprod: {
                src: 'client/config/config.prod.ts',
                dest: 'client/config/config.ts'
            }
        }
    });

    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-grunt');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('env', 'change environment to run the Angular app', function (target) {
        target = target || 'dev';

        grunt.task.run([
            'copy:config' + target
        ])
    });

    grunt.registerTask('build', 'change environment to run the Angular app', function (target) {
        target = target || 'dev';

        if (target === 'prod') {
            grunt.task.run([
                'env:prod',
                'shell:clientprod'
            ])
        } else if (target === 'test') {
            grunt.task.run([
                'env:prod',
                'shell:clienttest'
            ])
        } else {
            grunt.task.run([
                'env:dev',
                'shell:client'
            ])
        }
    });
};
