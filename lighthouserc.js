module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:performance': ['error', { minScore: 0.95 }],
      },
    },
    collect: {
      settings: {
        onlyCategories: ['accessibility', 'best-practices', 'performance'],
        preset: 'desktop',
      },
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/entite-juridique/010008407',
        'http://localhost:3000/etablissement-territorial-medico-social/010786036',
        'http://localhost:3000/etablissement-territorial-sanitaire/010005239',
        'http://localhost:3000/region/auvergne-rhone-alpes',
        'http://localhost:3000/accessibilite',
        'http://localhost:3000/mentions-legales',
        'http://localhost:3000/donnees-personnelles',
      ],
    },
    upload: {
      outputDir: 'lighthouse-ci-reports',
      target: 'filesystem',
    },
  },
}
