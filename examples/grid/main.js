require.config({
  appDir: './',
  baseUrl: '../../',
  // shim: {
  //   underscore: {
  //     exports: '_'
  //   },
  // },
  paths: {
      jquery: 'test/vendor/jquery',
      underscore: 'test/vendor/underscore'      
  }
});

define([
   'Context'
], function(intent){
  intent.axes.width.respond('standard');
});