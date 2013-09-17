// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],

    files: [
      'code/*.js',
      'test/*.js'
    ],

    browsers: process.env.TRAVIS ? ['Firefox'] : ['Chrome'],

    autoWatch: true
  });
};
/
