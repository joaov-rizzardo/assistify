module.exports = {
  ...require('@assistify/jest-commons/jest-e2e.config.js'),
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  setupFiles: ['<rootDir>/src/test/setup.ts']
};
