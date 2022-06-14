module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:performance': ['warn', { minScore: 1 }],
      },
    },
    collect: {
      startServerCommand: 'yarn build && yarn start',
      url: ['http://localhost:3000'],
    },
    upload: { target: 'temporary-public-storage' },
  },
}
