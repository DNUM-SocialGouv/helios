module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:performance': ['warn', { minScore: 1 }],
      },
    },
    collect: {
      startServerCommand: 'PORT=3001 npm start',
      url: ['http://localhost:3001/'],
    },
    upload: { target: 'temporary-public-storage' },
  },
}
