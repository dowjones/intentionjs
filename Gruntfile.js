//
module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-release');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    release: {
      options: {
        npm: false
      }
    },
    jshint: {
      files: ['**.js','test/*.js'],
        options: {
          ignores: ['code/*', 'test/vendor/**/*']
        }
    },
    uglify: {
      intention : {
        options: {
          banner: '/*! <%= pkg.name %> v<%= pkg.version %> \n* <%= pkg.homepage %> \n* \n* intention.js \n* \n* <%=pkg.copyright %>, <%= grunt.template.today("yyyy") %>\n* <%=pkg.banner %>*/ '
        },
        files: {
          'code/intention.min.js': ['intention.js']
        },
      },
       context: {
         options: {
           banner: '/*! <%= pkg.name %> v<%= pkg.version %> \n* <%= pkg.homepage %> \n* \n* context.js \n* \n* <%=pkg.copyright %>, <%= grunt.template.today("yyyy") %>\n* <%=pkg.banner %>*/ '
         },
         files: {
           'code/context.min.js':['context.js']
        }
      }
    }
  });
  grunt.registerTask('default', ['jshint', 'uglify']);
};
