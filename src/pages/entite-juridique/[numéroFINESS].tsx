import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { récupèreLEntitéJuridiqueEndpoint } from '../../backend/infrastructure/controllers/récupèreLEntitéJuridiqueEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { EntitéJuridique } from '../../backend/métier/entities/entité-juridique/EntitéJuridique'
import { ÉtablissementTerritorialRattaché } from '../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { useDependencies } from '../../frontend/ui/commun/contexts/useDependencies'
import { EntitéJuridiqueViewModel } from '../../frontend/ui/entité-juridique/EntitéJuridiqueViewModel'
import { ÉtablissementTerritorialRattachéViewModel } from '../../frontend/ui/entité-juridique/liste-des-établissements/ÉtablissementTerritorialRattachéViewModel'
import { PageEntitéJuridique } from '../../frontend/ui/entité-juridique/PageEntitéJuridique'

export default function Router(
  { entitéJuridique, établissementsTerritoriauxRattachés }:
  { entitéJuridique: EntitéJuridique, établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[] }
) {
  const { wording } = useDependencies()
  const entitéJuridiqueViewModel = new EntitéJuridiqueViewModel(entitéJuridique, wording)
  const établissementsTerritoriauxRattachésViewModels =
    établissementsTerritoriauxRattachés.map((établissementTerritorial) => new ÉtablissementTerritorialRattachéViewModel(établissementTerritorial, wording))
  return <PageEntitéJuridique
    entitéJuridiqueViewModel={entitéJuridiqueViewModel}
    établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
  />
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { entitéJuridique, établissementsTerritoriauxRattachés } = await récupèreLEntitéJuridiqueEndpoint(dependencies, context.query['numéroFINESS'] as string)
    return { props: { entitéJuridique, établissementsTerritoriauxRattachés } }
  } catch (error) {
    return { notFound: true }
  }
}
