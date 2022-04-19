module.exports = {
  rootDir: './',
  resetMocks: true,
  clearMocks: true,
  restoreMocks: true,
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
  ],
  moduleNameMapper: { '\\.(css)$': '<rootDir>/styleMock.ts' },
  testMatch: [
    '<rootDir>/src/**/*(*.)@(test).ts?(x)'
  ],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: [
    './jest.setup.js'
  ],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!src/pages/**',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest', {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ]
  },
}
