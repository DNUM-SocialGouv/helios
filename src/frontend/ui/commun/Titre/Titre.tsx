import Image, { StaticImageData } from 'next/image'
import { ReactElement } from 'react'

import styles from './Titre.module.css'

type TitreProps = Readonly<{
  logo: StaticImageData
  children: ReactElement | string
}>

export const Titre = ({ logo, children }: TitreProps) => {
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
    </div>
  )
}
