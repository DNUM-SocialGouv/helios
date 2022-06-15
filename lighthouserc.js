module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:performance': ['warn', { minScore: 1 }],
      },
    },
    collect: {
      emulatedFormFactor: 'desktop',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/entite-juridique/010008407',
        'http://localhost:3000/etablissement-territorial-medico-social/010786036',
        'http://localhost:3000/plan-du-site',
        'http://localhost:3000/accessibilite',
        'http://localhost:3000/mentions-legales',
        'http://localhost:3000/donnees-personnelles',
        'http://localhost:3000/gestion-des-cookies',
      ],
    },
    upload: {
      outputDir: 'lighthouse-ci-reports',
      target: 'filesystem',
    },
  },
}
