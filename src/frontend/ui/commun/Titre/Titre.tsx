import Image from 'next/image'
import { ReactElement } from 'react'

import LogoEntitéJuridique from '../../entité-juridique/logo-entité-juridique.svg'
import styles from './Titre.module.css'

type TypeTitre = Readonly<{
  children: ReactElement | string
}>

export const Titre = ({ children }: TypeTitre) => {
  return (
    <div className={styles['titre']}>
      <Image
        alt=""
        height="27"
        src={LogoEntitéJuridique}
        width="27"
      />
      <h1>
        {children}
      </h1>
    </div>
  )
}
