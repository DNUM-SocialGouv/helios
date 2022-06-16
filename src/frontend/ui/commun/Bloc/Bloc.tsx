import { ReactChild } from 'react'

import styles from './Bloc.module.css'

type BlocProps = Readonly<{
  children?: ReactChild | ReactChild[];
  estCeLePrincipal?: boolean,
  titre: string;
}>

export const Bloc = ({ children, estCeLePrincipal = false, titre }: BlocProps) => {
  const classeDuTitre = estCeLePrincipal ? styles['titre-bloc-principal'] : styles['titre-bloc-secondaire']

  return (
    <section aria-label={titre}>
      <h2 className={styles['titre-bloc'] + ' ' + classeDuTitre}>
        {titre}
      </h2>
      <div className={styles['contenu-bloc']}>
        {children}
      </div>
    </section>
  )
}
