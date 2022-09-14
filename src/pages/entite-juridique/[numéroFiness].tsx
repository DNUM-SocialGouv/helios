import { GetStaticPathsResult, GetStaticPropsResult } from 'next'

import { récupèreLEntitéJuridiqueEndpoint } from '../../backend/infrastructure/controllers/récupèreLEntitéJuridiqueEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { EntitéJuridique } from '../../backend/métier/entities/entité-juridique/EntitéJuridique'
import { ÉtablissementTerritorialRattaché } from '../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { EntitéJuridiqueNonTrouvée } from '../../backend/métier/entities/EntitéJuridiqueNonTrouvée'
import { useDependencies } from '../../frontend/ui/commun/contexts/useDependencies'
import { EntitéJuridiqueViewModel } from '../../frontend/ui/entité-juridique/EntitéJuridiqueViewModel'
import { ÉtablissementTerritorialRattachéViewModel } from '../../frontend/ui/entité-juridique/liste-des-établissements/ÉtablissementTerritorialRattachéViewModel'
import { PageEntitéJuridique } from '../../frontend/ui/entité-juridique/PageEntitéJuridique'

type RouterProps = Readonly<{
  entitéJuridique: EntitéJuridique,
  établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[]
}>

export default function Router({ entitéJuridique, établissementsTerritoriauxRattachés }: RouterProps) {
  const { wording } = useDependencies()

  if (!établissementsTerritoriauxRattachés || !entitéJuridique) return null

  const entitéJuridiqueViewModel = new EntitéJuridiqueViewModel(entitéJuridique, wording)
  const établissementsTerritoriauxRattachésViewModels =
    établissementsTerritoriauxRattachés.map((établissementTerritorial) => new ÉtablissementTerritorialRattachéViewModel(établissementTerritorial, wording))
  return <PageEntitéJuridique
    entitéJuridiqueViewModel={entitéJuridiqueViewModel}
    établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
  />
}

export function getStaticPaths(): GetStaticPathsResult {
  return {
    fallback: 'blocking',
    paths: [],
  }
}

export async function getStaticProps({ params }: { params: { numéroFiness: string }}): Promise<GetStaticPropsResult<RouterProps> | void> {
  try {
    const { environmentVariables } = dependencies
    const entitéJuridiqueEndpoint = await récupèreLEntitéJuridiqueEndpoint(dependencies, params.numéroFiness) as RouterProps

    return {
      props: {
        entitéJuridique: entitéJuridiqueEndpoint.entitéJuridique,
        établissementsTerritoriauxRattachés: entitéJuridiqueEndpoint.établissementsTerritoriauxRattachés,
      },
      revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE),
    }
  } catch (error) {
    if (error instanceof EntitéJuridiqueNonTrouvée) {
      dependencies.logger.error(error.message)
      return { notFound: true, revalidate: 1 }
    }
  }
}
