import Image from 'next/image'
import Link from 'next/link'
import '@gouvfr/dsfr/dist/component/footer/footer.min.css'

import { useDependencies } from '../contexts/useDependencies'

export const Footer = () => {
  const { paths, wording } = useDependencies()

  return (
    <footer
      className="fr-footer"
      role="contentinfo"
    >
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <p className="fr-logo">
              {wording.INTITULÉ_RÉPUBLIQUE_FRANÇAISE}
            </p>
            <Link
              href={paths.ACCUEIL}
              passHref
            >
              <a
                className="fr-footer__brand-link"
                title={wording.ACCUEIL}
              >
                <Image
                  alt=""
                  className="fr-responsive-img"
                  height="100"
                  src="/logo.svg"
                  width="100"
                />
              </a>
            </Link>
          </div>
          <div className="fr-footer__content">
            <p className="fr-footer__content-desc">
              {wording.PRESENTATION}
            </p>
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://legifrance.gouv.fr"
                  rel="external noopener noreferrer"
                  target="_blank"
                >
                  {wording.LEGIFRANCE}
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://gouvernement.fr"
                  rel="external noopener noreferrer"
                  target="_blank"
                >
                  {wording.GOUVERNEMENT}
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://service-public.fr"
                  rel="external noopener noreferrer"
                  target="_blank"
                >
                  {wording.SERVICE_PUBLIC}
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://data.gouv.fr"
                  rel="external noopener noreferrer"
                  target="_blank"
                >
                  {wording.DATA_GOUV}
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
              {wording.MENTION_LICENCE}
              <a
                href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                rel="external noopener noreferrer"
                target="_blank"
              >
                {wording.LICENCE_ETALAB}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
