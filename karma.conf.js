// karma.conf.js
module.exports = function (config) {
  'use strict';
  config.set({
    frameworks: ['mocha'],
    files: [
      'test/intention.tests.js',
      'test/context.tests.js'
    ],
    //browsers: process.env.TRAVIS ? ['Firefox'] : ['Chrome'],
    browsers: ['PhantomJS'],
    autoWatch: true
  });
};
