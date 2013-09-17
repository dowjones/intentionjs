module.exports = function (grunt) {
  'use strict';
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-fixmyjs');
  //grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-release');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    release: { options: { npm: false } },
    jshint: {
      files: [
        'Gruntfile.js',
        'intention.js',
        'context.js',
        'test/**/*.js'
      ],
      options: {
        ignores: [
          'test/vendor/**/*'
        ],
        jshintrc: '.jshintrc',
      }
    },
    clean: {
      intention: ['code/**/*']
    },
    fixmyjs: {
      options: {
        jshintrc: '.jshintrc'
      },
      intention: {
        files: [
          {expand: true, src: ['*.js'], dest: 'code/', ext: '.js'}
        ]
      }
    },
    mocha: {
      index: ['test/index.html']
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'mocha']
    },
    uglify: {
      intention: {
        options: { banner: '/*! <%= pkg.name %> v<%= pkg.version %> \n* <%= pkg.homepage %> \n* \n* intention.js \n* \n* <%=pkg.copyright %>, <%= grunt.template.today("yyyy") %>\n* <%=pkg.banner %>*/ ' },
        files: { 'code/intention.min.js': ['intention.js'] }
      },
      context: {
        options: { banner: '/*! <%= pkg.name %> v<%= pkg.version %> \n* <%= pkg.homepage %> \n* \n* context.js \n* \n* <%=pkg.copyright %>, <%= grunt.template.today("yyyy") %>\n* <%=pkg.banner %>*/ ' },
        files: { 'code/context.min.js': ['context.js'] }
      }
    }
  });
  grunt.registerTask('test', [
    'mocha'
  ]);
  grunt.registerTask('default', [
    'jshint',
    'mocha',
    'fixmyjs',
    'uglify',
    'watch'
  ]);
  grunt.registerTask('build', [
    'jshint',
    'clean',
    'fixmyjs',
    'mocha',
    'uglify'
  ]);
};
