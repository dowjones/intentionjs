module.exports = function (grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    release: { options: { npm: false } },
    jshint: {
      source: [
        'intention.js',
        'context.js',
        'Gruntfile.js'
      ],
      code: [
        'code/intention.js',
        'code/context.js',
      ],
      test: [
        'test/**/*.js'
      ],
      options: {
        ignores: [
          'test/vendor/**/*',
          'code/*min.js'
        ],
        jshintrc: '.jshintrc'
      }
    },
    clean: {
      code: ['<%= jshint.code %>'],
      config: ['code/Gruntfile.js', 'code/karma.js']
    },
    fixmyjs: {
      build: {
        files: [
          {expand: true, cwd: '.', src: ['*.js'], dest: 'code/', ext: '.js'}
        ],
        options: {
          jshintrc: '.jshintrc'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
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
      karma: {
        files: [
          '<%= jshint.source %>',
          'test/**/*'
        ],
        tasks: [
          'jshint:source',
          'karma:unit:run'
        ]
      }
    },
    uglify: {
      intention: {
        options: {
          banner: '/*! <%= pkg.name %> v<%= pkg.version %> \n* <%= pkg.homepage %> \n* \n* intention.js \n* \n* <%=pkg.copyright %>, <%= grunt.template.today("yyyy") %>\n* <%=pkg.banner %>*/ '
        },
        files: { 'code/intention.min.js': ['code/intention.js'] }
      },
      context: {
        options: {
          banner: '/*! <%= pkg.name %> v<%= pkg.version %> \n* <%= pkg.homepage %> \n* \n* context.js \n* \n* <%=pkg.copyright %>, <%= grunt.template.today("yyyy") %>\n* <%=pkg.banner %>*/ '
        },
        files: { 'code/context.min.js': ['code/context.js'] }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-fixmyjs');
  //grunt.loadNpmTasks('fixmyjs');
  //grunt.loadNpmTasks('karma');
  //grunt.loadNpmTasks('mocha');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask('default', [
    'jshint:source',
    'clean:code',
    'fixmyjs:build',
    'jshint:code',
    'clean:config',
    'jshint:test',
    'mocha',
    'uglify',
    'watch'
  ]);
  grunt.registerTask('test', [
    'jshint:source',
    'fixmyjs:build',
    'jshint:code',
    'jshint:test',
    'mocha'
  ]);
  grunt.registerTask('build', [
    'clean',
    'fixmyjs:build',
    'clean:config',
    'mocha',
    'uglify'
  ]);
};
