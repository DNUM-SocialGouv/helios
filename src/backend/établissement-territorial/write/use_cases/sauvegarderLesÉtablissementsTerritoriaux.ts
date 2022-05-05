import { ConvertXmlToJs } from '../../../shared/entities/ConvertXmlToJs'
import { ÉtablissementTerritorialIdentité } from '../entities/ÉtablissementTerritorial'
import { RécupérerLesÉtablissementsTerritoriauxLoader } from '../entities/ÉtablissementTerritorialFinessLoader'

export const sauvegarderLesÉtablissementsTerritoriaux = (
  récupérerLesÉtablissementsTerritoriauxLoader: RécupérerLesÉtablissementsTerritoriauxLoader,
  convertXmlToJs: ConvertXmlToJs,
  localPath: string
): ÉtablissementTerritorialIdentité[] => {
  const établissementsTerritoriaux = récupérerLesÉtablissementsTerritoriauxLoader(convertXmlToJs, localPath)

  return établissementsTerritoriaux
}
