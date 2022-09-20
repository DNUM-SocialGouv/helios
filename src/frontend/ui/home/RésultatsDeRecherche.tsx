import Image from 'next/image'

import { useDependencies } from '../commun/contexts/useDependencies'
import '@gouvfr/dsfr/dist/component/tile/tile.min.css'
import styles from './Recherche.module.css'
import { RechercheViewModel } from './RechercheViewModel'

type RésultatsDeRechercheProps = Readonly<{
  estCeQueLesRésultatsSontTousAffichés: boolean
  chargeLesRésultatsSuivants: () => void
  nombreRésultats: number
  résultats: RechercheViewModel[]
  termeFixe: string
}>

export const RésultatsDeRecherche = ({
  estCeQueLesRésultatsSontTousAffichés,
  chargeLesRésultatsSuivants,
  nombreRésultats,
  résultats,
  termeFixe,
}: RésultatsDeRechercheProps) => {
  const { wording } = useDependencies()

  return (
    <section aria-label={wording.RÉSULTAT_DE_RECHERCHE}>
      <p className="fr-h6 fr-mt-4w">
        {
          nombreRésultats === 0 &&
            wording.aucunRésultat(termeFixe) ||
            wording.rechercheNombreRésultats(nombreRésultats, termeFixe)
        }
      </p>
      <ul className={'fr-grid-row fr-grid-row--gutters ' + styles['tuiles']}>
        {résultats.map((résultatViewModel, index) => (
          <li
            className="fr-col-3"
            key={résultatViewModel.numéroFiness + index}
          >
            <div className="fr-tile fr-enlarge-link fr-tile--horizontal-md">
              <div className="fr-tile__body">
                <h2 className="fr-tile__title">
                  <a
                    className="fr-tile__link"
                    href={résultatViewModel.construisLeLien()}
                  >
                    {résultatViewModel.titre}
                  </a>
                </h2>
                <p className={'fr-tile__desc ' + styles['description']}>
                  {résultatViewModel.départementEtCommune}
                </p>
              </div>
              <div className={styles['tuile']}>
                <Image
                  alt=""
                  className="fr-responsive-img"
                  height="40"
                  src={résultatViewModel.afficheLeLogo()}
                  width="40"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {
        !estCeQueLesRésultatsSontTousAffichés &&
        <div className={styles['voir-plus-de-résultats']}>
          <button
            className="fr-btn fr-btn--secondary"
            onClick={chargeLesRésultatsSuivants}
          >
            {wording.VOIR_PLUS_RÉSULTATS}
          </button>
        </div>
      }
    </section>
  )
}
