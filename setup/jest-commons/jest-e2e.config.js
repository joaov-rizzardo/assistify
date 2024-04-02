module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  rootDir: './',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.(ts|js)x?$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
