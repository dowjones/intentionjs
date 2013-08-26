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
      underscore: 'test/vendor/underscore',
      page: 'example/page'
  }
});

define([
   'Context'
]);