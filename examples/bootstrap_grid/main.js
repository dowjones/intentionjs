require.config({
  appDir: './',
  baseUrl: '../../',
  paths: {
      jquery: 'test/vendor/jquery',
      underscore: 'test/vendor/underscore'      
  }
});

define([
   'Context'
]);