import { ÉtablissementTerritorialIdentité } from '../ÉtablissementTerritorialIdentité'

export type ÉtablissementTerritorialMédicoSocialIdentité = ÉtablissementTerritorialIdentité & Readonly<{
  estMonoÉtablissement: boolean
}>
