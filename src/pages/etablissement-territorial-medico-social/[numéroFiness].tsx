import { récupèreLÉtablissementTerritorialMédicoSocialEndpoint } from '../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialMédicoSocialEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { ÉtablissementTerritorialMédicoSocial } from '../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { useDependencies } from '../../frontend/ui/commun/contexts/useDependencies'
import { PageÉtablissementTerritorialMédicoSocial } from '../../frontend/ui/établissement-territorial-médico-social/PageÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialViewModel } from '../../frontend/ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel'

export default function Router({ établissementTerritorial }:
  { établissementTerritorial: ÉtablissementTerritorialMédicoSocial }) {
  const { paths, wording } = useDependencies()

  if (!établissementTerritorial) return null

  const établissementTerritorialViewModel = new ÉtablissementTerritorialMédicoSocialViewModel(établissementTerritorial, wording, paths)
  return <PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialViewModel} />
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
    const établissementTerritorial = await récupèreLÉtablissementTerritorialMédicoSocialEndpoint(dependencies, params.numéroFiness)

    return { props: { établissementTerritorial }, revalidate: Number(environmentVariables.TIME_OF_CACHE_PAGE) }
  } catch (error) {
    dependencies.logger.error(error)
    return { notFound: true, revalidate: 1 }
  }
}
