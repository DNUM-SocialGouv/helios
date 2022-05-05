import { environmentVariables } from '../../../../../tests/testHelper'
import { sauvegarderLesEntitésJuridiques } from './sauvegarderLesEntitésJuridiques'

describe('Sauvegarde des entités juridiques', () => {
  it('récupérer les établissements territoriaux de plusieurs sources de données', () => {
    // GIVEN
    const récupérerLesEntitésJuridiquesLoader = jest.fn()
    const convertXmlToJs = jest.fn()
    const localPath = environmentVariables.SFTP_LOCAL_PATH

    // WHEN
    sauvegarderLesEntitésJuridiques(récupérerLesEntitésJuridiquesLoader, convertXmlToJs, localPath)

    // THEN
    expect(récupérerLesEntitésJuridiquesLoader).toHaveBeenCalledWith(convertXmlToJs, localPath)
  })
})
