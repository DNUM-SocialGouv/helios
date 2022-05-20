import { GetServerSidePropsContext } from 'next'

import { récupèreLEntitéJuridiqueEndpoint } from '../../backend/infrastructure/controllers/récupèreLEntitéJuridiqueEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { PageEntitéJuridique } from '../../frontend/ui/entite/PageEntitéJuridique'

export default function Router({ entitéJuridique }) {
  return <PageEntitéJuridique entitéJuridique={entitéJuridique} />
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const entitéJuridique = await récupèreLEntitéJuridiqueEndpoint(dependencies, context.query.numéroFINESS)

  return { props: { entitéJuridique } }
}
