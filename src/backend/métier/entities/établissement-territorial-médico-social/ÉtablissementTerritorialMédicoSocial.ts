import { ÉtablissementTerritorialIdentité } from '../ÉtablissementTerritorialIdentité'
import { EntitéJuridiqueDeRattachement } from './EntitéJuridiqueDeRattachement'
import { MonoÉtablissement } from './MonoÉtablissement'
import { ÉtablissementTerritorialMédicoSocialActivité } from './ÉtablissementTerritorialMédicoSocialActivité'

export type ÉtablissementTerritorialMédicoSocial = Readonly<{
  activité: ÉtablissementTerritorialMédicoSocialActivité[]
  identité: ÉtablissementTerritorialIdentité &
    MonoÉtablissement &
    EntitéJuridiqueDeRattachement
}>
