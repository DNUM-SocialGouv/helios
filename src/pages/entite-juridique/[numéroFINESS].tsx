import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { récupèreLEntitéJuridiqueEndpoint } from '../../backend/infrastructure/controllers/récupèreLEntitéJuridiqueEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { EntitéJuridique } from '../../backend/métier/entities/EntitéJuridique'
import { useDependencies } from '../../frontend/ui/commun/contexts/useDependencies'
import { EntitéJuridiqueViewModel } from '../../frontend/ui/entité-juridique/EntitéJuridiqueViewModel'
import { PageEntitéJuridique } from '../../frontend/ui/entité-juridique/PageEntitéJuridique'

export default function Router({ entitéJuridique }: { entitéJuridique: EntitéJuridique }) {
  const { wording } = useDependencies()
  const entitéJuridiqueViewModel = new EntitéJuridiqueViewModel(entitéJuridique, wording)
  return <PageEntitéJuridique entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const entitéJuridique = await récupèreLEntitéJuridiqueEndpoint(dependencies, context.query['numéroFINESS'] as string)
    return { props: { entitéJuridique } }
  } catch (error) {
    return { notFound: true }
  }
}
