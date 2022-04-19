import Image from 'next/image'
import Link from 'next/link'
import '@gouvfr/dsfr/dist/component/footer/footer.min.css'

import { useDependencies } from '../contexts/useDependencies'

export const Footer = () => {

  const { wording } = useDependencies()

  return (
    <footer
      className="fr-footer"
      id="footer"
      role="contentinfo"
    >
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <p className="fr-logo">
              {wording.INTITULÉ_DU_MINISTÈRE_SOCIAL}
            </p>
            <Link
              href="/"
              passHref
            >
              <a
                className="fr-footer__brand-link"
                title={wording.ACCÉDER_À_L_ACCUEIL}
              >
                <Image
                  alt={wording.ALT_LOGO_HELIOS}
                  className="fr-responsive-img"
                  height="30"
                  src="/logo_helios_fond_transparent.png"
                  width="100"
                />
              </a>
            </Link>
          </div>
          <div className="fr-footer__content">
            {/* <p className="fr-footer__content-desc">À remplir</p> */}
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://legifrance.gouv.fr"
                  rel="noreferrer"
                  target="_blank"
                >
                  legifrance.gouv.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://gouvernement.fr"
                  rel="noreferrer"
                  target="_blank"
                >
                  gouvernement.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://service-public.fr"
                  rel="noreferrer"
                  target="_blank"
                >
                  service-public.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://data.gouv.fr"
                  rel="noreferrer"
                  target="_blank"
                >
                  data.gouv.fr
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <a
                className="fr-footer__bottom-link"
                href="#"
              >
                Plan du site
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a
                className="fr-footer__bottom-link"
                href="#"
              >
                Accessibilité : non/partiellement/totalement conforme
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a
                className="fr-footer__bottom-link"
                href="#"
              >
                Mentions légales
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a
                className="fr-footer__bottom-link"
                href="#"
              >
                Données personnelles
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a
                className="fr-footer__bottom-link"
                href="#"
              >
                Gestion des cookies
              </a>
            </li>
          </ul>
          <div className="fr-footer__bottom-copy">
            <p>
              Sauf mention contraire, tous les contenus de ce site sont sous
              {' '}
              <a
                href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                rel="noreferrer"
                target="_blank"
              >
                licence etalab-2.0
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
