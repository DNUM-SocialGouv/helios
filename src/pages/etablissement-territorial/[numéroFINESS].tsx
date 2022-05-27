import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { récupèreLÉtablissementTerritorialEndpoint } from '../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { ÉtablissementTerritorialMédicoSocialIdentité } from '../../backend/métier/entities/ÉtablissementTerritorialMédicoSocial/ÉtablissementTerritorialMédicoSocialIdentité'
import { useDependencies } from '../../frontend/ui/commun/contexts/useDependencies'
import { PageÉtablissementTerritorial } from '../../frontend/ui/établissement-territorial/PageÉtablissementTerritorial'
import { ÉtablissementTerritorialViewModel } from '../../frontend/ui/établissement-territorial/ÉtablissementTerritorialViewModel'

export default function Router({ établissementTerritorialMédicoSocial }: { établissementTerritorialMédicoSocial: ÉtablissementTerritorialMédicoSocialIdentité }) {
  const { wording } = useDependencies()
  const établissementTerritorialViewModel = new ÉtablissementTerritorialViewModel(établissementTerritorialMédicoSocial, wording)
  return <PageÉtablissementTerritorial établissementTerritorialViewModel={établissementTerritorialViewModel} />
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const établissementTerritorial = await récupèreLÉtablissementTerritorialEndpoint(dependencies, context.query['numéroFINESS'] as string)
    return { props: { établissementTerritorial } }
  } catch (error) {
    return { notFound: true }
  }
}
