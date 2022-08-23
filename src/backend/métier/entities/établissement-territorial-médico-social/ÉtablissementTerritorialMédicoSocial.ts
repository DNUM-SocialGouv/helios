import { ÉtablissementTerritorialIdentité } from '../ÉtablissementTerritorialIdentité'
import { EntitéJuridiqueDeRattachement } from './EntitéJuridiqueDeRattachement'
import { MonoÉtablissement } from './MonoÉtablissement'
import { ÉtablissementTerritorialMédicoSocialActivité } from './ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité } from './ÉtablissementTerritorialMédicoSocialAutorisation'

export type ÉtablissementTerritorialMédicoSocial = Readonly<{
  activités: ÉtablissementTerritorialMédicoSocialActivité[]
  autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité
  identité: ÉtablissementTerritorialIdentité &
    MonoÉtablissement &
    EntitéJuridiqueDeRattachement
}>
