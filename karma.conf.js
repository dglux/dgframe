module.exports = function(config) {
  config.set({

    basePath: './',

    frameworks: ['mocha', 'browserify'],

    files: ['test/test.js'],

    exclude: [],

    preprocessors: {
      'test/test.js': ['browserify']
    },

    browserify: {
      debug: true
    },

    reporters: ['spec'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    singleRun: false

  });
};
