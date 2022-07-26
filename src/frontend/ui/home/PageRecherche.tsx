import { FormulaireDeRecherche } from './FormulaireDeRecherche'
import { RechercheEnAttente } from './RechercheEnAttente'
import { RésultatsDeRecherche } from './RésultatsDeRecherche'
import { useRecherche } from './useRecherche'

export const PageRecherche = () => {
  const {
    estCeEnAttente,
    estCeQueLesRésultatsSontReçus,
    lancerLaRecherche,
    nombreRésultats,
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

      {estCeEnAttente && <RechercheEnAttente />}

      {estCeQueLesRésultatsSontReçus &&
        <RésultatsDeRecherche
          nombreRésultats={nombreRésultats}
          résultats={résultats}
          termeFixe={termeFixe}
        />
      }
    </>
  )
}
