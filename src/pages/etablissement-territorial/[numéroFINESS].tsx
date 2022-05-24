import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { récupèreLÉtablissementTerritorialEndpoint } from '../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { ÉtablissementTerritorialIdentité } from '../../backend/métier/entities/ÉtablissementTerritorialIdentité'
import { useDependencies } from '../../frontend/ui/commun/contexts/useDependencies'

export default function Router({ établissementTerritorial }: { établissementTerritorial: ÉtablissementTerritorialIdentité }) {
  const { wording } = useDependencies()
  return <br />
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const établissementTerritorial = await récupèreLÉtablissementTerritorialEndpoint(dependencies, context.query['numéroFINESS'] as string)
    return { props: { établissementTerritorial } }
  } catch (error) {
    return { notFound: true }
  }
}
