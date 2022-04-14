import Image from 'next/image'

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
                <div className="fr-header__operator">
                  <Image
                    alt="logo d'Helios"
                    className="fr-responsive-img"
                    height="30"
                    src="/logo_helios_fond_transparent.png"
                    width="100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
