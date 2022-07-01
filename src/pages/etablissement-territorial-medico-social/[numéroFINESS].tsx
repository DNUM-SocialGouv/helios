import { GetServerSideProps, GetServerSidePropsContext } from 'next'

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

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const établissementTerritorial = await récupèreLÉtablissementTerritorialMédicoSocialEndpoint(dependencies, context.query['numéroFINESS'] as string)
    return { props: { établissementTerritorial } }
  } catch (error) {
    return { notFound: true }
  }
}
