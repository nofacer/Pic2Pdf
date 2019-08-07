  /*jshint esversion: 6 */
  const common = require('./jest.config.js');

  module.exports = {
      projects: [{
          ...common,
          testMatch: ['**/__funcTest__/**/*.spec.(js|jsx|ts|tsx)']
      }]
  };