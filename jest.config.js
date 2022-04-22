const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!src/pages/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
  ],
  resetMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/src/**/*(*.)@(test).ts?(x)'],
}

module.exports = createJestConfig(customJestConfig)
