module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!<rootDir>/src/**/index.js',
    '!<rootDir>/src/**/schema.js',
    '!<rootDir>/src/**/server.js',
    '!<rootDir>/src/**/apolloServer.js',
  ],
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
};
