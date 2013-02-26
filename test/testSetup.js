require.config({
  appDir: './',
  baseUrl: '../',
  paths: {
      jquery: 'test/vendor/jquery',
      page: 'example/page'
  }
});

requirejs([
   'test/test'
]);