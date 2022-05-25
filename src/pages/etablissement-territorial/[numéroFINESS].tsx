import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { récupèreLÉtablissementTerritorialEndpoint } from '../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { ÉtablissementTerritorialIdentité } from '../../backend/métier/entities/ÉtablissementTerritorialIdentité'
import { PageÉtablissementTerritorial } from '../../frontend/ui/établissement-territorial/PageÉtablissementTerritorial'
import { ÉtablissementTerritorialViewModel } from '../../frontend/ui/établissement-territorial/ÉtablissementTerritorialViewModel'

export default function Router({ établissementTerritorial }: { établissementTerritorial: ÉtablissementTerritorialIdentité }) {
  const établissementTerritorialViewModel = new ÉtablissementTerritorialViewModel(établissementTerritorial)
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
