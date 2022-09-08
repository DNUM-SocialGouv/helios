import { useDependencies } from '../commun/contexts/useDependencies'
import { BandeauDInformation } from './BandeauDInformation'
import { FormulaireDeRecherche } from './FormulaireDeRecherche'
import { RechercheEnAttente } from './RechercheEnAttente'
import { RésultatsDeRecherche } from './RésultatsDeRecherche'
import { useRecherche } from './useRecherche'

export const PageRecherche = () => {
  const { wording } = useDependencies()

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
      <BandeauDInformation texte={wording.SITE_EN_CONSTRUCTION} />

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
