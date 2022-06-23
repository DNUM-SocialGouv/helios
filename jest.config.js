const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  clearMocks: true,
  // TODO
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'data-crawler/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!database/**',
    '!src/pages/**',
    '!src/**/test-factories/**',
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
  testMatch: [
    '<rootDir>/src/**/*(*.)@(test).ts?(x)',
    '<rootDir>/data-crawler/**/*(*.)@(test).ts?(x)',
  ],
}

async function jestConfig() {
  const nextJestConfig = await createJestConfig(customJestConfig)()
  // /node_modules/ is the first pattern
  nextJestConfig.transformIgnorePatterns[0] = '/node_modules/(?!uuid)/'
  return nextJestConfig
}

module.exports = jestConfig
