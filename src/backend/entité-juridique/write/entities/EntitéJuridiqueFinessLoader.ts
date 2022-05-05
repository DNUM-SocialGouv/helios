import { ConvertXmlToJs } from '../../../shared/entities/ConvertXmlToJs'
import { EntitéJuridique } from './EntitéJuridique'

export type RécupérerLesEntitésJuridiquesLoader = (convertXmlToJs: ConvertXmlToJs, localPath: string) => EntitéJuridique[]
