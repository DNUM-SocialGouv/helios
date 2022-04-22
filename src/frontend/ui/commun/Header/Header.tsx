import Image from 'next/image'
import Link from 'next/link'
import '@gouvfr/dsfr/dist/component/header/header.min.css'
import '@gouvfr/dsfr/dist/component/logo/logo.min.css'
import '@gouvfr/dsfr/dist/component/link/link.min.css'
import '@gouvfr/dsfr/dist/component/modal/modal.min.css'

import { useDependencies } from '../contexts/useDependencies'
import { FilDArianne } from '../FilDArianne/FilDArianne'

export const Header = () => {
  const { wording } = useDependencies()

  return (
    <>
      <header className="fr-header">
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
                  <div className="fr-header__navbar">
                    <button
                      aria-controls="modal-833"
                      aria-haspopup="menu"
                      className="fr-btn--menu fr-btn"
                      data-fr-opened="false"
                      id="fr-btn-menu-mobile"
                      title={wording.MENU}
                      type="button"
                    >
                      {wording.MENU}
                    </button>
                  </div>
                </div>
                <div className="fr-header__service">
                  <Link
                    href="/"
                    passHref
                  >
                    <a title={wording.ACCUEIL}>
                      <Image
                        alt=""
                        className="fr-responsive-img"
                        height="30"
                        src="/logo.png"
                        width="100"
                      />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="fr-header__tools">
                <div className="fr-header__tools-links">
                  <ul className="fr-links-group">
                    <li>
                      <a
                        className="fr-link fr-fi-logout-box-r-fill"
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
        <div
          aria-labelledby="fr-btn-menu-mobile"
          className="fr-header__menu fr-modal"
          id="modal-833"
        >
          <div className="fr-container">
            <button
              aria-controls="modal-833"
              className="fr-link--close fr-link"
              type="button"
            >
              {wording.FERMER}
            </button>
            <div className="fr-header__menu-links"></div>
          </div>
        </div>
      </header>
      <FilDArianne />
    </>
  )
}
