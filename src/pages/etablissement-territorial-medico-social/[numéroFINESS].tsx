import { récupèreLÉtablissementTerritorialMédicoSocialEndpoint } from '../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialMédicoSocialEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { ÉtablissementTerritorialMédicoSocial } from '../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { useDependencies } from '../../frontend/ui/commun/contexts/useDependencies'
import { PageÉtablissementTerritorialMédicoSocial } from '../../frontend/ui/établissement-territorial-médico-social/PageÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialMédicoSocialViewModel } from '../../frontend/ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel'

export default function Router({ établissementTerritorial }:
  { établissementTerritorial: ÉtablissementTerritorialMédicoSocial }) {
  const { wording } = useDependencies()
  const établissementTerritorialViewModel = new ÉtablissementTerritorialMédicoSocialViewModel(établissementTerritorial, wording)
  return <PageÉtablissementTerritorialMédicoSocial établissementTerritorialViewModel={établissementTerritorialViewModel} />
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
    const établissementTerritorial = await récupèreLÉtablissementTerritorialMédicoSocialEndpoint(dependencies, params.numéroFINESS)

    return { props: { établissementTerritorial }, revalidate: Number(environmentVariables.TIME_OF_SERVER_SHUTDOWN_AT_NIGHT) }
  } catch (error) {
    return { notFound: true }
  }
}
