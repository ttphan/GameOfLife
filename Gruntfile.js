module.exports = function (grunt) {
  grunt.initConfig({
    jasmine: {
      coverage: {
        src: 'js/*.js',
        options: {
          specs: 'test/spec/*.js',
          vendor: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js',
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            template: 'test/SpecRunnerTemplate.tmpl',
            coverage: 'test/coverage/coverage.json',
            report: [
              {
                type: 'html',
                options: {
                  dir: 'test/coverage/html'
                }
              },
              {
                type: 'cobertura',
                options: {
                  dir: 'test/coverage/cobertura'
                }
              },
              {
                type: 'text-summary'
              }
            ]
          }
        }
      }
    },
    jshint: {
      files: 'js/*.js',
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        undef: true,
        globals: {
          "$": false
        }
      }
    }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('default', ['jshint', 'jasmine']);
};