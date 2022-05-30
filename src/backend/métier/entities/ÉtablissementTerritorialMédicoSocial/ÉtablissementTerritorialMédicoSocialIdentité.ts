import { ÉtablissementTerritorialIdentité } from '../ÉtablissementTerritorialIdentité'
import { EntitéJuridiqueDeRattachement } from './EntitéJuridiqueDeRattachement'
import { MonoÉtablissement } from './MonoÉtablissement'

export type ÉtablissementTerritorialMédicoSocialIdentité =
  ÉtablissementTerritorialIdentité &
  MonoÉtablissement &
  Readonly<{ entitéJuridiqueDeRattachement: EntitéJuridiqueDeRattachement }>
