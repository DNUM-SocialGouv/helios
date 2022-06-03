import Link from 'next/link'
import { ReactChild } from 'react'

import styles from './LienVersLÉtablissementTerritorial.module.css'

type LienVersLÉtablissementTerritorialType = Readonly<{
  label: ReactChild
  lien: string
  logo: ReactChild
}>

export const LienVersLÉtablissementTerritorial = ({ label, lien, logo }: LienVersLÉtablissementTerritorialType ) => {

  return (
    <li
      className={styles['élément-liste-établissements-territoriaux-rattachés']}
    >
      {logo}
      <Link
        href={lien}
        passHref
      >
        <a>
          {label}
        </a>
      </Link>
    </li>

  )
}
