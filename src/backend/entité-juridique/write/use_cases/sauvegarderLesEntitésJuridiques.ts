import { ConvertXmlToJs } from '../../../shared/entities/ConvertXmlToJs'
import { EntitéJuridique } from '../entities/EntitéJuridique'
import { RécupérerLesEntitésJuridiquesLoader } from '../entities/EntitéJuridiqueFinessLoader'

export function sauvegarderLesEntitésJuridiques(
  récupérerLesEntitésJuridiquesLoader: RécupérerLesEntitésJuridiquesLoader,
  convertXmlToJs: ConvertXmlToJs,
  localPath: string
): EntitéJuridique[] {
  const entitésJuridiques = récupérerLesEntitésJuridiquesLoader(convertXmlToJs, localPath)

  return entitésJuridiques
}
