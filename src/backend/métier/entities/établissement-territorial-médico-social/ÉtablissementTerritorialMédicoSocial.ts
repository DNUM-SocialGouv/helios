import { ÉtablissementTerritorialIdentité } from '../ÉtablissementTerritorialIdentité'
import { EntitéJuridiqueDeRattachement } from './EntitéJuridiqueDeRattachement'
import { MonoÉtablissement } from './MonoÉtablissement'
import { ÉtablissementTerritorialMédicoSocialActivité } from './ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialMédicoSocialAutorisation } from './ÉtablissementTerritorialMédicoSocialAutorisation'

export type ÉtablissementTerritorialMédicoSocial = Readonly<{
  activités: ÉtablissementTerritorialMédicoSocialActivité[]
  autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialAutorisation
  identité: ÉtablissementTerritorialIdentité &
    MonoÉtablissement &
    EntitéJuridiqueDeRattachement
}>
