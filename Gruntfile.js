//
module.exports = function(grunt){
  //grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-release');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    release: {
      options:{
        npm:false
      }
    },
    uglify:{
      intention : {
        options:{
          banner: '/*! <%= pkg.name %> v<%= pkg.version %>\
\n* http://intentionjs.com/\
\n*\
\n*\ intention.js\
\n*\
\n* Copyright 2011, <%= grunt.template.today("yyyy") %>\ Dowjones and other contributors\
\n* Released under the MIT license\
\n*\
\n*/\n'
         },
         files: {
           'code/intention.min.js': ['intention.js']
         }
       },
       context: {
         options:{
           banner: '/*! <%= pkg.name %> v<%= pkg.version %>\
\n* http://intentionjs.com/\
\n*\
\n*\ context.js\
\n*\
\n* Copyright 2011, <%= grunt.template.today("yyyy") %>\ Dowjones and other contributors\
\n* Released under the MIT license\
\n*\
\n*/\n'
         },
         files: {

           'code/context.min.js':['context.js']
        }
      }
    }
  });


}
