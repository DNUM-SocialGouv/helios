import { GetStaticPathsResult, GetStaticPropsResult } from 'next'

import { récupèreLÉtablissementTerritorialSanitaireEndpoint } from '../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialSanitaireEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { ÉtablissementTerritorialSanitaire } from '../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../../backend/métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { useDependencies } from '../../frontend/ui/commun/contexts/useDependencies'
import { PageÉtablissementTerritorialSanitaire } from '../../frontend/ui/établissement-territorial-sanitaire/PageÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireViewModel } from '../../frontend/ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel'

type RouterProps = Readonly<{
  établissementTerritorial: ÉtablissementTerritorialSanitaire
}>

export default function Router({ établissementTerritorial }: RouterProps) {
  const { paths, wording } = useDependencies()

  if (!établissementTerritorial) return null

  const établissementTerritorialSanitaireViewModel = new ÉtablissementTerritorialSanitaireViewModel(établissementTerritorial, wording, paths)
  return <PageÉtablissementTerritorialSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel} />
}

export function getStaticPaths(): GetStaticPathsResult {
  return {
    fallback: 'blocking',
    paths: [],
  }
}

export async function getStaticProps({ params }: { params: { numeroFiness: string }}): Promise<GetStaticPropsResult<RouterProps> | void> {
  try {
    const { environmentVariables } = dependencies
    const établissementTerritorial =
      await récupèreLÉtablissementTerritorialSanitaireEndpoint(dependencies, params.numeroFiness) as ÉtablissementTerritorialSanitaire

    return { props: { établissementTerritorial }, revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE) }
  } catch (error) {
    if (error instanceof ÉtablissementTerritorialSanitaireNonTrouvée) {
      dependencies.logger.error(error.message)
      return { notFound: true, revalidate: 1 }
    }
  }
}
