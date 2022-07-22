import Image from 'next/image'
import { useEffect, useState } from 'react'

import { useDependencies } from '../commun/contexts/useDependencies'
import '@gouvfr/dsfr/dist/component/button/button.min.css'
import '@gouvfr/dsfr/dist/component/input/input.min.css'
import '@gouvfr/dsfr/dist/component/search/search.min.css'
import '@gouvfr/dsfr/dist/component/tile/tile.min.css'
import styles from './Recherche.module.css'
import { RechercheViewModel } from './RechercheViewModel'
import { Résultat } from '../../../backend/métier/entities/RésultatDeRecherche'

export const Recherche = () => {
  const { paths, wording } = useDependencies()
  const [nombreResultat, setNombreResultat] = useState(0)
  const [recherche, setRecherche] = useState('')
  const [rechercheLancé, setRechercheLancé] = useState('')
  const [rechercheDemandée, setRechercheDemandée] = useState(false)
  const [résultatAffiché, setRésultatAffiché] = useState(false)
  const [résultats, setRésultats] = useState<RechercheViewModel[]>([])
  const [enAttente, setEnAttente] = useState(true)

  const rechercher = (event: React.MouseEvent) => {
    event.preventDefault()
    setRechercheDemandée(true)
  }

  const rechercheHandler = (event) => {
    setRecherche(event.target.value)
  }

  useEffect(() => {
    if (rechercheDemandée) {
      setRésultatAffiché(false)
      setEnAttente(true)
      fetch('http://localhost:3000/api/recherche', {
        body: JSON.stringify({ terme: recherche }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
        .then((response) => response.json())
        .then((data) => {
          setRésultats(data.résultats.map((résultat: Résultat) => new RechercheViewModel(résultat, paths)))
          setNombreResultat(data.nombreDeRésultats)
          setRechercheLancé(recherche)
          setEnAttente(false)
          setRechercheDemandée(false)
          setRésultatAffiché(true)
        })
    }
  }, [rechercheDemandée])

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
              onChange={rechercheHandler}
              placeholder={wording.RECHERCHE_PLACEHOLDER}
              type="search"
              value={recherche}
            />
            <button
              className="fr-btn"
              onClick={rechercher}
            >
              {wording.RECHERCHE_LABEL}
            </button>
          </form>
        </section>
      </div>
      {(enAttente && rechercheDemandée) &&
      <section> En Attende de résultat</section>
      }
      {résultatAffiché &&
        <section aria-label={wording.RECHERCHE_RESULTAT}>
          <p className="fr-h6 fr-mt-4w">
            {wording.RECHERCHE_NOMBRE_RESULTAT(nombreResultat, rechercheLancé)}
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
