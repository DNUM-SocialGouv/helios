import { récupèreLÉtablissementTerritorialSanitaireEndpoint } from '../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialSanitaireEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { ÉtablissementTerritorialSanitaire } from '../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { useDependencies } from '../../frontend/ui/commun/contexts/useDependencies'
import { PageÉtablissementTerritorialSanitaire } from '../../frontend/ui/établissement-territorial-sanitaire/PageÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireViewModel } from '../../frontend/ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel'

export default function Router({ établissementTerritorial }:
  { établissementTerritorial: ÉtablissementTerritorialSanitaire }) {
  const { wording } = useDependencies()
  const établissementTerritorialViewModel = new ÉtablissementTerritorialSanitaireViewModel(établissementTerritorial, wording)
  return <PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialViewModel} />
}

export function getStaticPaths() {
  return {
    fallback: 'blocking',
    paths: [],
  }
}

export async function getStaticProps({ params }: { params: { numéroFINESS: string }}) {
  try {
    const { environmentVariables } = dependencies
    const établissementTerritorial = await récupèreLÉtablissementTerritorialSanitaireEndpoint(dependencies, params.numéroFINESS)

    return { props: { établissementTerritorial }, revalidate: Number(environmentVariables.TIME_OF_SERVER_SHUTDOWN_AT_NIGHT) }
  } catch (error) {
    return { notFound: true }
  }
}
