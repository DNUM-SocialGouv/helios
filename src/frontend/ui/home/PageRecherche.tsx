import '@gouvfr/dsfr/dist/component/button/button.min.css'
import '@gouvfr/dsfr/dist/component/input/input.min.css'
import '@gouvfr/dsfr/dist/component/search/search.min.css'
import '@gouvfr/dsfr/dist/component/tile/tile.min.css'
import { FormulaireDeRecherche } from './FormulaireDeRecherche'
import { RechercheEnAttente } from './RechercheEnAttente'
import { RésultatsDeRecherche } from './RésultatsDeRecherche'
import { useRecherche } from './useRecherche'

export const Recherche = () => {
  const {
    estCeEnAttente,
    estCeQueLesRésultatsSontReçus,
    lancerLaRecherche,
    nombreResultat,
    rechercheOnChange,
    résultats,
    terme,
    termeFixe,
  } = useRecherche()

  return (
    <>
      <FormulaireDeRecherche
        lancerLaRecherche={lancerLaRecherche}
        rechercheOnChange={rechercheOnChange}
        terme={terme}
      />
      {estCeEnAttente &&
        <RechercheEnAttente />
      }
      {estCeQueLesRésultatsSontReçus &&
        <RésultatsDeRecherche
          nombreResultat={nombreResultat}
          résultats={résultats}
          termeFixe={termeFixe}
        />
      }
    </>
  )
}
