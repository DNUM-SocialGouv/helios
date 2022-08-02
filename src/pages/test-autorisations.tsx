import Link from 'next/link'

import { useBreadcrumb } from '../frontend/ui/commun/hooks/useBreadcrumb'
import '@gouvfr/dsfr/dist/component/tag/tag.min.css'

export default function Recette() {
  useBreadcrumb([])

  return (
    <>
      <p>TODO (hors DSFR)</p>
      <ul>
        <li>mettre les éléments cliquable en gras et le background en foncé</li>
        <li>décalage par défaut du troisième niveau, est-ce grave ?</li>
      </ul>
      <ul className="fr-accordion">
        <li className="fr-accordion__title">
          <Link
            href="#"
            passHref
          >
            <a
              aria-controls="accordion-106"
              aria-expanded="false"
              className="fr-tag"
              href="#"
              onClick={(event) => {
                event.preventDefault()
              }}
            >
              Accueil temporaire pour Personnes Âgées [657]
            </a>
          </Link>
          <ul
            className="fr-accordion fr-collapse"
            id="accordion-106"
          >
            <li className="fr-accordion__title">
              <Link
                href="#"
                passHref
              >
                <a
                  aria-controls="accordion-107"
                  aria-expanded="false"
                  className="fr-tag"
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                  }}
                >
                  Hébergement Complet Internat [11]
                </a>
              </Link>
            </li>
            <div
              className="fr-collapse"
              id="accordion-107"
            >
              <ul className="fr-tags-group fr-mb-2w">
                <li className="fr-tag fr-fi-arrow-right-line fr-tag--icon-left fr-text--bold">
                  PH vieillissantes [702]
                </li>
                <li>
                  <p className="fr-tag">Date d’autorisation : 31/01/2017</p>
                </li>
                <li>
                  <p className="fr-tag">Mise à jour d’autorisation : 17/03/2017</p>
                </li>
                <li>
                  <p className="fr-tag">Dernière installation : 2017/01/31</p>
                </li>
                <li>
                  <p className="fr-tag">Capacité autorisée : 2</p>
                </li>
                <li>
                  <p className="fr-tag">Capacité installée : 2</p>
                </li>
                <li>
                  <p className="fr-tag">Capacité installée : 2</p>
                </li>
              </ul>
              <ul className="fr-tags-group">
                <li className="fr-tag fr-fi-arrow-right-line fr-tag--icon-left fr-text--bold">
                  PH vieillissantes [702]
                </li>
                <li>
                  <p className="fr-tag">Date d’autorisation : 31/01/2017</p>
                </li>
                <li>
                  <p className="fr-tag">Mise à jour d’autorisation : 17/03/2017</p>
                </li>
                <li>
                  <p className="fr-tag">Dernière installation : 2017/01/31</p>
                </li>
              </ul>
            </div>
          </ul>
        </li>
      </ul>
    </>
  )
}
