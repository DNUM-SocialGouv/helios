import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  rootDir: './',
  resetMocks: true,
  clearMocks: true,
  restoreMocks: true,
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
  ],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/styleMock.ts',
  },
  testMatch: [
    '<rootDir>/src/**/*(*.)@(test).ts?(x)',
  ],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!src/pages/**',
  ],
}

export default config
