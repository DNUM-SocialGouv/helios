import { récupèreLÉtablissementTerritorialSanitaireEndpoint } from '../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialSanitaireEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { ÉtablissementTerritorialSanitaire } from '../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { useDependencies } from '../../frontend/ui/commun/contexts/useDependencies'
import { PageÉtablissementTerritorialSanitaire } from '../../frontend/ui/établissement-territorial-sanitaire/PageÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireViewModel } from '../../frontend/ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel'

export default function Router({ établissementTerritorial }:
  { établissementTerritorial: ÉtablissementTerritorialSanitaire }) {
  const { paths, wording } = useDependencies()

  if (!établissementTerritorial) return null

  const établissementTerritorialViewModel = new ÉtablissementTerritorialSanitaireViewModel(établissementTerritorial, wording, paths)
  return <PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialViewModel} />
}

export function getStaticPaths() {
  return {
    fallback: 'blocking',
    paths: [],
  }
}

export async function getStaticProps({ params }: { params: { numéroFiness: string }}) {
  try {
    const { environmentVariables } = dependencies
    const établissementTerritorial = await récupèreLÉtablissementTerritorialSanitaireEndpoint(dependencies, params.numéroFiness)

    return { props: { établissementTerritorial }, revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE) }
  } catch (error) {
    dependencies.logger.error(error)
    return { notFound: true, revalidate: 1 }
  }
}
