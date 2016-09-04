module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-route/angular-route.js',
      'public/bower_components/angular-resource/angular-resource.js',
      'public/bower_components/angular-mocks/angular-mocks.js',
      'public/script.js',
      'public/scriptSpec.js'
    ],
    reporters: ['spec'],
    exclude: [],
    port: 8080,
    // logging level : 
    //       LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file for re-executing tests
    autoWatch: false,
    browsers: ['Chrome'],
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
