import { ReactChild } from 'react'

import styles from './Bloc.module.css'

type BlocProps = Readonly<{
  titre: string;
  children?: ReactChild | ReactChild[];
}>

export const Bloc = ({ titre, children }: BlocProps) => {

  return (
    <section aria-label={titre}>
      <h3 className={styles['titre-bloc']}>
        {titre}
      </h3>
      <div className={styles['contenu-bloc']}>
        {children}
      </div>
    </section>
  )
}
