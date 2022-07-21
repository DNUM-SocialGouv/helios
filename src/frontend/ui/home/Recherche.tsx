import Image from 'next/image'
import { useState } from 'react'

import { useDependencies } from '../commun/contexts/useDependencies'
import '@gouvfr/dsfr/dist/component/button/button.min.css'
import '@gouvfr/dsfr/dist/component/input/input.min.css'
import '@gouvfr/dsfr/dist/component/search/search.min.css'
import '@gouvfr/dsfr/dist/component/tile/tile.min.css'
import LogoÉtablissementTerritorialMédicoSocial from '../entité-juridique/liste-des-établissements/logo-établissement-territorial-médico-social-noir.svg'
import LogoÉtablissementTerritorialSanitaire from '../entité-juridique/liste-des-établissements/logo-établissement-territorial-sanitaire-noir.svg'
import LogoEntitéJuridiqueNoir from './logo-entité-juridique-noir.svg'
import styles from './Recherche.module.css'

export const Recherche = () => {
  const { wording } = useDependencies()
  const nombreResultat = 12
  const recherche = 'Centre hospitalier de Saint Brieuc'
  const [resultatReçu, setResultatReçu] = useState(false)

  // TODO: faire un viewModel
  const résultats = Array(12)
    .fill({
      commune: 'Saint-Brieuc',
      département: 'Côtes d’Armor',
      numéroFiness: '220000020',
      raisonSociale: 'CENTRE HOSPITALIER DE SAINT BRIEUC',
      type: 'Médico-social',
    }, 0, 4)
    .fill({
      commune: 'Saint-Brieuc',
      département: 'Côtes d’Armor',
      numéroFiness: '220000020',
      raisonSociale: 'CENTRE HOSPITALIER DE SAINT BRIEUC',
      type: 'Sanitaire',
    }, 4, 8)
    .fill({
      commune: 'Saint-Brieuc',
      département: 'Côtes d’Armor',
      numéroFiness: '220000020',
      raisonSociale: 'CENTRE HOSPITALIER DE SAINT BRIEUC',
      type: 'Entité Juridique',
    }, 8, 12)

  const afficherLogo = (type: string): string => {
    if (type === 'Médico-social') {
      return LogoÉtablissementTerritorialMédicoSocial
    } else if (type === 'Sanitaire') {
      return LogoÉtablissementTerritorialSanitaire
    }
    return LogoEntitéJuridiqueNoir
  }

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
              placeholder={wording.RECHERCHE_PLACEHOLDER}
              type="search"
            />
            <button
              className="fr-btn"
              onClick={(e) => {
                e.preventDefault();setResultatReçu(true)
              }}
            >
              {wording.RECHERCHE_LABEL}
            </button>
          </form>
        </section>
      </div>
      {resultatReçu &&
        <section aria-label={wording.RECHERCHE_RESULTAT}>
          <p className="fr-h6 fr-mt-4w">
            {wording.RECHERCHE_NOMBRE_RESULTAT(nombreResultat, recherche)}
          </p>
          <ul className="fr-grid-row fr-grid-row--gutters">
            {résultats.map((résultat, index) => (
              <li
                className="fr-col-3"
                key={résultat.numéroFiness + index}
              >
                <div className="fr-tile fr-enlarge-link fr-tile--horizontal">
                  <div className="fr-tile__body">
                    <h2 className="fr-tile__title">
                      <a
                        className="fr-tile__link"
                        href=""
                      >
                        {résultat.numéroFiness}
                        {' - '}
                        {résultat.raisonSociale}
                      </a>
                    </h2>
                    <p className="fr-tile__desc">
                      {résultat.département + ', ' + résultat.commune}
                    </p>
                  </div>
                  <div className="fr-tile__img">
                    <Image
                      alt=""
                      className="fr-responsive-img"
                      height="27"
                      src={afficherLogo(résultat.type)}
                      width="27"
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
