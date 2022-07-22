import Image from 'next/image'

import { useDependencies } from '../commun/contexts/useDependencies'
import '@gouvfr/dsfr/dist/component/button/button.min.css'
import '@gouvfr/dsfr/dist/component/input/input.min.css'
import '@gouvfr/dsfr/dist/component/search/search.min.css'
import '@gouvfr/dsfr/dist/component/tile/tile.min.css'
import styles from './Recherche.module.css'
import { useRecherche } from './useRecherche'

export const Recherche = () => {
  const { wording } = useDependencies()
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
      <div className="fr-grid-row fr-grid-row--center">
        <section className={'fr-col-8 ' + styles['formulaire']}>
          <h1>
            {wording.RECHERCHE_TITRE}
          </h1>
          <p>
            {wording.RECHERCHE_DESCRIPTION}
          </p>
          <form
            action="/"
            className="fr-search-bar fr-search-bar--lg"
            id="search-2"
            role="search"
          >
            <label
              className="fr-label"
              htmlFor="search-787-input"
            >
              {wording.RECHERCHE_LABEL}
            </label>
            <input
              className="fr-input"
              id="search-787-input"
              name="search-787-input"
              onChange={rechercheOnChange}
              placeholder={wording.RECHERCHE_PLACEHOLDER}
              type="search"
              value={terme}
            />
            <button
              className="fr-btn"
              onClick={lancerLaRecherche}
              type="submit"
            >
              {wording.RECHERCHE_LABEL}
            </button>
          </form>
        </section>
      </div>
      {estCeEnAttente &&
        <section>
          <p className="fr-mt-4w">
            {wording.RECHERCHE_EN_ATTENTE}
          </p>
        </section>
      }
      {estCeQueLesRésultatsSontReçus &&
        <section>
          <p className="fr-h6 fr-mt-4w">
            {wording.RECHERCHE_NOMBRE_RESULTAT(nombreResultat, termeFixe)}
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
                    <p className="fr-tile__desc">
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
        </section>
      }
    </>
  )
}
