import { récupèreLEntitéJuridiqueEndpoint } from '../../backend/infrastructure/controllers/récupèreLEntitéJuridiqueEndpoint'
import { dependencies } from '../../backend/infrastructure/dependencies'
import { EntitéJuridique } from '../../backend/métier/entities/entité-juridique/EntitéJuridique'
import { ÉtablissementTerritorialRattaché } from '../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { useDependencies } from '../../frontend/ui/commun/contexts/useDependencies'
import { EntitéJuridiqueViewModel } from '../../frontend/ui/entité-juridique/EntitéJuridiqueViewModel'
import { ÉtablissementTerritorialRattachéViewModel } from '../../frontend/ui/entité-juridique/liste-des-établissements/ÉtablissementTerritorialRattachéViewModel'
import { PageEntitéJuridique } from '../../frontend/ui/entité-juridique/PageEntitéJuridique'

export default function Router(
  { entitéJuridique, établissementsTerritoriauxRattachés }:
  { entitéJuridique: EntitéJuridique, établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[] }
) {
  const { wording } = useDependencies()
  const entitéJuridiqueViewModel = new EntitéJuridiqueViewModel(entitéJuridique, wording)
  const établissementsTerritoriauxRattachésViewModels =
    établissementsTerritoriauxRattachés.map((établissementTerritorial) => new ÉtablissementTerritorialRattachéViewModel(établissementTerritorial, wording))
  return <PageEntitéJuridique
    entitéJuridiqueViewModel={entitéJuridiqueViewModel}
    établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels}
  />
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
    const entitéJuridiqueEndpoint = await récupèreLEntitéJuridiqueEndpoint(dependencies, params.numéroFINESS)

    if (entitéJuridiqueEndpoint === undefined) {
      return { notFound: true }
    }

    return {
      props: {
        entitéJuridique: entitéJuridiqueEndpoint.entitéJuridique,
        établissementsTerritoriauxRattachés: entitéJuridiqueEndpoint.établissementsTerritoriauxRattachés,
      },
      revalidate: Number(environmentVariables.TIME_OF_SERVER_SHUTDOWN_AT_NIGHT),
    }
  } catch (error) {
    return { notFound: true }
  }
}
