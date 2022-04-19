import Image from 'next/image'
import Link from 'next/link'
import '@gouvfr/dsfr/dist/component/header/header.min.css'
import '@gouvfr/dsfr/dist/component/logo/logo.min.css'

import { useDependencies } from '../contexts/useDependencies'

export const Header = () => {
  const { wording } = useDependencies()

  return (
    <header
      className="fr-header"
      role="banner"
    >
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">
                    {wording.INTITULÉ_DU_MINISTÈRE_SOCIAL}
                  </p>
                </div>
              </div>
              <div className="fr-header__service">
                <Link
                  href="/"
                  passHref
                >
                  <a title={wording.ACCÉDER_À_L_ACCUEIL}>
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
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <ul className="fr-btns-group">
                  <li>
                    <a
                      className="fr-btn fr-fi-logout-box-r-fill"
                      href="#"
                    >
                      {wording.DÉCONNEXION}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
