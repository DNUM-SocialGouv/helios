import { ÉtablissementTerritorialIdentité } from '../ÉtablissementTerritorialIdentité'
import { EntitéJuridiqueDeRattachement } from './EntitéJuridiqueDeRattachement'
import { MonoÉtablissement } from './MonoÉtablissement'
import { ÉtablissementTerritorialMédicoSocialActivité } from './ÉtablissementTerritorialMédicoSocialActivité'

export type ÉtablissementTerritorialMédicoSocial = Readonly<{
  activités: ÉtablissementTerritorialMédicoSocialActivité[]
  identité: ÉtablissementTerritorialIdentité &
    MonoÉtablissement &
    EntitéJuridiqueDeRattachement
}>
