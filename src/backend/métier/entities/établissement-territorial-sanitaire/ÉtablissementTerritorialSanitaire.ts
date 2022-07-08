import { ÉtablissementTerritorialIdentité } from '../ÉtablissementTerritorialIdentité'
import { EntitéJuridiqueDeRattachement } from './EntitéJuridiqueDeRattachement'
import { ÉtablissementTerritorialSanitaireActivité } from './ÉtablissementTerritorialSanitaireActivité'

export type ÉtablissementTerritorialSanitaire = Readonly<{
  activités: ÉtablissementTerritorialSanitaireActivité[]
  identité: ÉtablissementTerritorialIdentité &
    EntitéJuridiqueDeRattachement
}>
