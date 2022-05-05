import { ConvertXmlToJs } from '../../../shared/entities/ConvertXmlToJs'
import { ÉtablissementTerritorialIdentité } from './ÉtablissementTerritorial'

export type RécupérerLesÉtablissementsTerritoriauxLoader = (convertXmlToJs: ConvertXmlToJs, localPath: string) => ÉtablissementTerritorialIdentité[]
