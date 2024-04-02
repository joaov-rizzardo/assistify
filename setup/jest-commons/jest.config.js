module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  rootDir: './',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.(ts|js)x?$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
