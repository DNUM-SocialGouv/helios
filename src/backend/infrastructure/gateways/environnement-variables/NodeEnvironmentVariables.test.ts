import { fakeLogger } from '../../../testHelper'
import { NodeEnvironmentVariables } from './NodeEnvironmentVariables'

describe('Charge les variables d’environnement', () => {
  it('retourne la valeur définie dans le fichier .env', () => {
    // WHEN
    const nodeEnvironmentVariables = new NodeEnvironmentVariables(fakeLogger)

    // THEN
    expect(nodeEnvironmentVariables.SENTRY_AUTH_TOKEN).toBe('test_sentry_auth_token')
  })

  it('retourne une phrase explicite quand la valeur n’est pas dans le fichier .env', () => {
    // GIVEN
    process.env['ORM_DEBUG'] = 'toBeSet'

    // WHEN
    const nodeEnvironmentVariables = new NodeEnvironmentVariables(fakeLogger)

    // THEN
    expect(fakeLogger.error).toHaveBeenCalledWith('----- WARNING ----- La variable d’environnement "ORM_DEBUG" est manquante.')
    expect(nodeEnvironmentVariables.ORM_DEBUG).toBe('')
  })
})
