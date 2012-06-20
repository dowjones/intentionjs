var requirejs = require('requirejs')
  , should = require('should')
  , fs = require('fs');

function getTestModules() {
  return fs.readdirSync(__dirname).filter(function (path) {
    return path.match(/.*-test.js$/);
  }).map(function (file) {
    return file.replace(/(.*)\.js/, 'test/$1');
  });
}

requirejs.config({
    baseUrl: './lib/assets/js'
  , paths: {
      test: '../../../test'
    }
});

requirejs(getTestModules(), function () {
  // done testing
});
