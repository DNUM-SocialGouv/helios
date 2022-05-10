import '@gouvfr/dsfr/dist/component/link/link.min.css'
import '@gouvfr/dsfr/dist/component/accordion/accordion.min.css'
import { ReactChild } from 'react'

import styles from './Bloc.module.css'

type BlocProps = Readonly<{
  titre: string;
  children?: ReactChild | ReactChild[];
}>

export const Bloc = ({ titre, children }: BlocProps) => {

  return (
    <section>
      <h3 className={styles['titre-bloc']}>
        {titre}
      </h3>
      <div className={styles['contenu-bloc']}>
        {children}
      </div>
    </section>
  )
}
