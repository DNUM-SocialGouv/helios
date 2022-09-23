import nextJest from 'next/jest'

import type { Config } from '@jest/types'

const createJestConfig = nextJest({ dir: './' })

const customJestConfig: Config.InitialOptions = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'datacrawler/**/*.ts',
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
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/src/**/*(*.)@(test).ts?(x)',
    '<rootDir>/datacrawler/**/*(*.)@(test).ts',
  ],
}

async function jestConfig() {
  const nextJestConfig = await createJestConfig(customJestConfig)()
  // /node_modules/ is the first pattern
  nextJestConfig.transformIgnorePatterns[0] = '/node_modules/(?!uuid)/'
  return nextJestConfig
}

module.exports = jestConfig
