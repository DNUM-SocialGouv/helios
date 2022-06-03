import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { récupèreLÉtablissementTerritorialSanitaireEndpoint } from '../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialSanitaireEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { ÉtablissementTerritorialSanitaireIdentité } from '../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireIdentité'
import { useDependencies } from '../../frontend/ui/commun/contexts/useDependencies'
import { PageÉtablissementTerritorialSanitaire } from '../../frontend/ui/établissement-territorial-sanitaire/PageÉtablissementTerritorialSanitaire'
import { ÉtablissementTerritorialSanitaireViewModel } from '../../frontend/ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel'

export default function Router({ établissementTerritorial }:
  { établissementTerritorial: ÉtablissementTerritorialSanitaireIdentité }) {
  const { wording } = useDependencies()
  const établissementTerritorialViewModel = new ÉtablissementTerritorialSanitaireViewModel(établissementTerritorial, wording)
  return <PageÉtablissementTerritorialSanitaire établissementTerritorialViewModel={établissementTerritorialViewModel} />
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const établissementTerritorial = await récupèreLÉtablissementTerritorialSanitaireEndpoint(dependencies, context.query['numéroFINESS'] as string)
    return { props: { établissementTerritorial } }
  } catch (error) {
    return { notFound: true }
  }
}
