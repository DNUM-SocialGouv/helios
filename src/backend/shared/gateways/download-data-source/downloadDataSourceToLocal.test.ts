import fs from 'fs'
import Client from 'ssh2-sftp-client'

import { environmentVariables } from '../../../../../tests/testHelper'
import { downloadDataSourceToLocal } from './downloadDataSourceToLocal'

describe('Téléchargement d’une source de données via un SFTP', () => {
  const dataSource = 'FAKE_DATASOURCE_NAME'
  const sftpPath = 'fake_path'
  const localPath = 'data_test/fake_local_path'

  it('créer un répertoire au nom de la source de données avant de la télécharger', async () => {
    // GIVEN
    setup()

    // WHEN
    await downloadDataSourceToLocal(dataSource, sftpPath, localPath, environmentVariables)

    // THEN
    expect(fs.mkdirSync).toHaveBeenCalledWith(localPath, { recursive: true })
  })

  it('effacer tous les fichiers du répertoire de la source de données pour éviter d’utiliser d’anciennes données', async () => {
    // GIVEN
    setup()

    // WHEN
    await downloadDataSourceToLocal(dataSource, sftpPath, localPath, environmentVariables)

    // THEN
    expect(fs.rmSync).toHaveBeenCalledWith(localPath, { force: true, recursive: true })
  })

  it('se connecter au SFTP, télécharger un répertoire et se déconnecter', async () => {
    // GIVEN
    setup()

    // WHEN
    await downloadDataSourceToLocal(dataSource, sftpPath, localPath, environmentVariables)

    // THEN
    expect(Client.prototype.connect).toHaveBeenCalledWith({
      debug: undefined,
      host: 'localhost',
      port: 22,
      privateKey: 'privateKey',
      username: 'usr_finess_ls',
    })
    expect(console.info).toHaveBeenNthCalledWith(1, `[Helios][${dataSource}] La connexion au SFTP est ouverte.`)
    expect(Client.prototype.list).toHaveBeenCalledWith('/')
    expect(Client.prototype.downloadDir).toHaveBeenCalledWith(sftpPath, localPath)
    expect(console.info).toHaveBeenNthCalledWith(2, `[Helios][${dataSource}] Sources de données téléchargées.`)
    expect(console.info).toHaveBeenNthCalledWith(3, `[Helios][${dataSource}] Le connexion au SFTP est fermée.`)
    expect(Client.prototype.end).toHaveBeenCalledWith()
  })

  it('se connecter au SFTP avec une mauvaise configuration et avoir un message d’erreur', async () => {
    // GIVEN
    setup()
    const errorMessage = 'connexion impossible'
    jest.spyOn(Client.prototype, 'connect').mockImplementation(async (): Promise<any> => await Promise.reject(new Error(errorMessage)))

    try {
      // WHEN
      await downloadDataSourceToLocal(dataSource, sftpPath, localPath, environmentVariables)
      throw new Error('ne devrait pas passer ici')
    } catch (error) {
      // THEN
      expect(error.message).toBe(`[Helios][${dataSource}] Une erreur est survenue lors de la connexion au SFTP : ${errorMessage}`)
    }
  })
})

function setup() {
  jest.spyOn(console, 'info').mockImplementation()
  jest.spyOn(fs, 'mkdirSync').mockImplementation()
  jest.spyOn(fs, 'rmSync').mockImplementation()
  jest.spyOn(fs, 'readFileSync').mockReturnValue('privateKey')
  jest.spyOn(Client.prototype, 'connect').mockImplementation(async (): Promise<any> => await jest.fn())
  jest.spyOn(Client.prototype, 'list').mockImplementation(async (): Promise<any> => await jest.fn())
  jest.spyOn(Client.prototype, 'downloadDir').mockImplementation(async (): Promise<any> => await jest.fn())
  jest.spyOn(Client.prototype, 'end').mockImplementation(async (): Promise<any> => await jest.fn())
}
