import { environmentVariables } from '../../../../../tests/testHelper'
import { sauvegarderLesÉtablissementsTerritoriaux } from './sauvegarderLesÉtablissementsTerritoriaux'

describe('Sauvegarde des établissements territoriaux', () => {
  it('récupérer les établissements territoriaux de plusieurs sources de données', () => {
    // GIVEN
    const récupérerLesÉtablissementsTerritoriauxLoader = jest.fn()
    const convertXmlToJs = jest.fn()
    const localPath = environmentVariables.SFTP_LOCAL_PATH

    // WHEN
    sauvegarderLesÉtablissementsTerritoriaux(récupérerLesÉtablissementsTerritoriauxLoader, convertXmlToJs, localPath)

    // THEN
    expect(récupérerLesÉtablissementsTerritoriauxLoader).toHaveBeenCalledWith(convertXmlToJs, localPath)
  })
})
