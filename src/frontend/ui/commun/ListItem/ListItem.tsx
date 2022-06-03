import Link from 'next/link'
import { ReactChild } from 'react'

import styles from './ListItem.module.css'

type ListItemType = Readonly<{
  label: ReactChild
  lien: string
  logo: ReactChild
}>

export const ListItem = ({ label, lien, logo }: ListItemType ) => {

  return (
    <li
      className={styles['élément-liste']}
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
