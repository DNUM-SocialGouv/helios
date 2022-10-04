import nextJest from 'next/jest'

import type { Config } from '@jest/types'

const createJestConfig = nextJest({ dir: './' })

const customJestConfig: Config.InitialOptions = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'download/**/*.ts',
    '!**/node_modules/**',
    '!database/**',
    '!src/pages/**',
    '!src/**/test-factories/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
  ],
  resetMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/src/**/*(*.)@(test).ts?(x)',
    '<rootDir>/download/**/*(*.)@(test).ts',
  ],
}

async function jestConfig() {
  const nextJestConfig = await createJestConfig(customJestConfig)()
  // /node_modules/ is the first pattern
  nextJestConfig.transformIgnorePatterns[0] = '/node_modules/(?!uuid)/'

  // Stryker ne fonctionne pas à cause de l'async https://github.com/stryker-mutator/stryker-js/issues/3480
  // Pour que les mutants naissent, il faut générer ce fichier donc lancer au moins un test
  require('fs').writeFileSync('jest-for-mutation-testing.json', JSON.stringify(nextJestConfig, null, 2))

  return nextJestConfig
}

module.exports = jestConfig
