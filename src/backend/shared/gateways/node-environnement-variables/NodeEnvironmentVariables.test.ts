import { NodeEnvironmentVariables } from './NodeEnvironmentVariables'

describe('Gestion des variables d’environnement', () => {
  it('retourne la valeur définie dans le fichier .env', () => {
    // GIVEN
    jest.spyOn(console, 'error').mockImplementation()

    // WHEN
    const envVar = new NodeEnvironmentVariables()

    // THEN
    expect(envVar.SENTRY_AUTH_TOKEN).toBe('test_sentry_auth_token')
  })

  it('retourne une phrase explicite quand la valeur n’est pas dans le fichier .env', () => {
    // GIVEN
    jest.spyOn(console, 'error').mockImplementation()
    process.env['SFTP_HOST'] = 'toBeSet'

    // WHEN
    const envVar = new NodeEnvironmentVariables()

    // THEN
    expect(console.error).toHaveBeenCalledWith('----- WARNING ----- La variable d’environnement "SFTP_HOST" est manquante.')
    expect(envVar.SFTP_HOST).toBe('')
  })
})
