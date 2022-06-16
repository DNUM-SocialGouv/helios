import { ReactChild } from 'react'

import styles from './Bloc.module.css'

type BlocProps = Readonly<{
  titre: string;
  children?: ReactChild | ReactChild[];
}>

export const Bloc = ({ titre, children }: BlocProps) => {
  return (
    <section aria-label={titre}>
      <h2 className={styles['titre-bloc']}>
        {titre}
      </h2>
      <div className={styles['contenu-bloc']}>
        {children}
      </div>
    </section>
  )
}
