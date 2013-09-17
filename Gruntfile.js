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
      source: [
        'intention.js',
        'context.js'
      ],
      code: [
        'code/intention.js',
        'code/context.js',
        'Gruntfile.js'
      ],
      test: ['test/**/*'],
      options: {
        ignores: [
          'test/vendor/**/*',
          'code/*min.js'
        ],
        jshintrc: '.jshintrc'
      }
    },
    clean: {
      intention: ['code/**/*'],
      grunt: ['code/Gruntfile.js']
    },
    fixmyjs: {
      options: {
        jshintrc: '.jshintrc',
        intention: {
          files: [{
            expand: true,
            src: ['*.js'],
            dest: 'code/',
            ext: '.js'
          }]
        }
      }
    },
    mocha: {
      intention: [
        'test/index.html',
        'test/context-tests.html'
      ],
      options: {
        run: true,
        ui: 'bdd'
      }
    },
    watch: {
      files: [
        '<%= jshint.source %>',
        'test/**/*'
      ],
      tasks: [
        'jshint:source',
        'mocha'
      ]
    },
    uglify: {
      intention: {
        options: { banner: '/*! <%= pkg.name %> v<%= pkg.version %> \n* <%= pkg.homepage %> \n* \n* intention.js \n* \n* <%=pkg.copyright %>, <%= grunt.template.today("yyyy") %>\n* <%=pkg.banner %>*/ ' },
        files: { 'code/intention.min.js': ['code/intention.js'] }
      },
      context: {
        options: { banner: '/*! <%= pkg.name %> v<%= pkg.version %> \n* <%= pkg.homepage %> \n* \n* context.js \n* \n* <%=pkg.copyright %>, <%= grunt.template.today("yyyy") %>\n* <%=pkg.banner %>*/ ' },
        files: { 'code/context.min.js': ['code/context.js'] }
      }
    }
  });
  grunt.registerTask('default', [
    'jshint:source',
    'fixmyjs',
    'jshint:code',
    'mocha',
    'uglify',
    'clean:grunt'
  ]);
  grunt.registerTask('test', ['mocha']);
  grunt.registerTask('build', [
    'clean',
    'fixmyjs',
    'clean:grunt',
    'mocha',
    'uglify'
  ]);
};
