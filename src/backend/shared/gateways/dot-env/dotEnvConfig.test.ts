import dotenv from 'dotenv-defaults'

import { dotEnvConfig } from './dotEnvConfig'

describe('Gestion des variables d’environnements en dehors de NextJs', () => {
  it('charger les fichiers .env et .env.local en utf8', () => {
    // GIVEN
    jest.spyOn(dotenv, 'config').mockImplementation(jest.fn())

    // WHEN
    dotEnvConfig()

    // THEN
    expect(dotenv.config).toHaveBeenCalledWith({
      defaults: './.env',
      encoding: 'utf8',
      path: './.env.local',
    })
  })
})
