import Image from 'next/image'
import { ReactElement } from 'react'

import logoEntitéJuridique from './logo-entité-juridique.svg'
import styles from './Titre.module.css'

type TypeTitre = Readonly<{
  children: ReactElement | string
}>

export const Titre = ({ children }: TypeTitre) => {
  return (
    <h1 className={styles['titre']}>
      <Image
        alt=""
        className={styles['img']}
        height="27"
        src={logoEntitéJuridique}
        width="27"
      />
      <span>
        {children}
      </span>
    </h1>
  )
}
