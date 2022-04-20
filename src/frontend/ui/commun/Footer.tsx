import Image from 'next/image'
import Link from 'next/link'
import '@gouvfr/dsfr/dist/component/footer/footer.min.css'

import { useDependencies } from '../contexts/useDependencies'

export const Footer = () => {

  const { paths, wording } = useDependencies()

  return (
    <footer
      className="fr-footer pied-de-page"
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
              href={paths.ACCUEIL}
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
              <Link
                href={paths.PLAN_DU_SITE}
                passHref
              >
                <a className="fr-footer__bottom-link">
                  {wording.PLAN_DU_SITE}
                </a>
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link
                href={paths.ACCESSIBILITÉ}
                passHref
              >
                <a className="fr-footer__bottom-link">
                  {wording.ACCESSIBILITÉ}
                </a>
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link
                href={paths.MENTIONS_LÉGALES}
                passHref
              >
                <a className="fr-footer__bottom-link">
                  {wording.MENTIONS_LÉGALES}
                </a>
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link
                href={paths.DONNÉES_PERSONNELLES}
                passHref
              >
                <a className="fr-footer__bottom-link">
                  {wording.DONNÉES_PERSONNELLES}
                </a>
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link
                href={paths.GESTION_COOKIES}
                passHref
              >
                <a className="fr-footer__bottom-link">
                  {wording.GESTION_COOKIES}
                </a>
              </Link>
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
