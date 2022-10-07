import dotenv from 'dotenv-defaults'

import { dotEnvConfig } from './dotEnvConfig'

describe('Gestion des variables d’environnements en dehors de NextJs', () => {
  it('charge les fichiers .env et .env.test en utf8 quand je suis en test', () => {
    // GIVEN
    jest.spyOn(dotenv, 'config').mockImplementation(jest.fn())

    // WHEN
    dotEnvConfig('test')

    // THEN
    expect(dotenv.config).toHaveBeenCalledWith({
      defaults: './.env',
      encoding: 'utf8',
      path: './.env.test',
    })
  })

  it('charge les fichiers .env et .env.local en utf8 quand je suis en développement', () => {
    // GIVEN
    jest.spyOn(dotenv, 'config').mockImplementation(jest.fn())

    // WHEN
    dotEnvConfig('development')

    // THEN
    expect(dotenv.config).toHaveBeenCalledWith({
      defaults: './.env',
      encoding: 'utf8',
      path: './.env.local',
    })
  })

  it('ne charge rien quand on est en production', () => {
    // GIVEN
    jest.spyOn(dotenv, 'config').mockImplementation(jest.fn())

    // WHEN
    dotEnvConfig('production')

    // THEN
    expect(dotenv.config).not.toHaveBeenCalled()
  })
})
