  /*jshint esversion: 6 */
  const common = require('./jest.config.js');

  module.exports = {
      projects: [{
          ...common,
          runner: '@jest-runner/electron',
          testEnvironment: '@jest-runner/electron/environment',
          testMatch: ['**/__unitTest__/**/*.spec.(js|jsx|ts|tsx)']
      }, {
          ...common,
          testMatch: ['**/__funcTest__/**/*.spec.(js|jsx|ts|tsx)']
      }]
  };