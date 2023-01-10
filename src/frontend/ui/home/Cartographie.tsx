import Image from 'next/image'
import Link from 'next/link'

import { useDependencies } from '../commun/contexts/useDependencies'
import { régions } from '../région/régions'
import carteFrance from './carte-france.svg'
import '@gouvfr/dsfr/dist/component/card/card.min.css'
import styles from './Cartographie.module.css'

export const Cartographie = () => {
  const { paths, wording } = useDependencies()

  return (
    <section aria-label={wording.CARTOGRAPHIE}>
      <h2 className={styles['titre']}>{wording.CARTOGRAPHIE}</h2>
      <div className="fr-card fr-card--horizontal fr-card--no-arrow">
        <div className={'fr-card__body ' + styles['body']}>
          <div className="fr-card__content">
            <h3 className="fr-card__title">{wording.OFFRE_SANTÉ_PAR_REGION}</h3>
            <p className="fr-card__desc">{wording.CARTOGRAPHIE_DESCRIPTION}</p>
          </div>
          <div className="fr-card__footer">
            <ul className="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
              <li>
                <Link className="fr-btn" href={paths.RÉGION + '/auvergne-rhone-alpes'} passHref>
                  {régions['auvergne-rhone-alpes'].label}
                </Link>
              </li>
              <li>
                <Link className="fr-btn" href={paths.RÉGION + '/occitanie'} passHref>
                  {régions['occitanie'].label}
                </Link>
              </li>
              <li>
                <Link className="fr-btn" href={paths.RÉGION + '/bretagne'} passHref>
                  {régions['bretagne'].label}
                </Link>
              </li>
              <li>
                <Link className="fr-btn" href={paths.RÉGION + '/pays-de-la-loire'} passHref>
                  {régions['pays-de-la-loire'].label}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-card__header">
          <Image alt="" height="300" src={carteFrance} width="300" />
        </div>
      </div>
    </section>
  )
}
