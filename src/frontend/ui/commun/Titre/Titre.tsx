import Image, { StaticImageData } from 'next/future/image'
import { ReactElement } from 'react'

import { useDependencies } from '../contexts/useDependencies'
import styles from './Titre.module.css'

type TitreProps = Readonly<{
  logo: StaticImageData
  children: ReactElement | string
}>

export const Titre = ({ logo, children }: TitreProps) => {
  const { wording } = useDependencies()
  const imprimer = () => window.print()

  return (
    <div className={styles['titre']}>
      <Image
        alt=""
        height="27"
        src={logo}
        width="27"
      />
      <h1>
        {children}
      </h1>
      <div>
        <button
          className="fr-btn fr-btn--secondary fr-fi-download-line fr-btn--icon-left"
          onClick={imprimer}
          title={wording.TÉLÉCHARGER_EN_PDF}
          type="button"
        >
          {wording.TÉLÉCHARGER_EN_PDF}
        </button>
      </div>
    </div>
  )
}
