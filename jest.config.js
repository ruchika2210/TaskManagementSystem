module.exports = {
    testEnvironment: 'node',
    testMatch: [    '**/Unit/**/*.test.js', '**/Integration/**/*.test.js'],
    testPathIgnorePatterns: ['/node_modules/'],
    setupFiles: ['<rootDir>/jest.setup.js'],
  };
  