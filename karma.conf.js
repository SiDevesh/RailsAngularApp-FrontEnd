//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',

      /* Added manually for angular-material */
      'bower_components/angular-material/angular-material-mocks.js',

      'components/**/*.js',
      'view*/**/*.js'
    ],

    /* Added for angular-material but this LIBS section is mentioned in sample karma-conf given at angular-material install instruction but angular-seed didn't have this, the mock file from here though i've added to above files section...understand this and then work it out
    var LIBS = [
      'node_modules/angular/angular.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/angular-material/angular-material.js',

      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-material/angular-material-mocks.js'
    ];
    */

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
