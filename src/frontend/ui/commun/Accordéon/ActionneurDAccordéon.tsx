import Link from 'next/link'

import styles from './ActionneurDAccordéon.module.css'

type ActionneurDAccordéonProps = Readonly<{
  for: string
  titre: string
}>

export const ActionneurDAccordéon = ({ for: identifiant, titre }: ActionneurDAccordéonProps) => {

  return (
    <Link
      href="#"
      passHref
    >
      <a
        aria-controls={identifiant}
        aria-expanded="false"
        className={'fr-tag fr-text-label--grey fr-text--bold ' + styles['tag-actionnable']}
        href="#"
        onClick={(event) => {
          event.preventDefault()
        }}
      >
        {titre}
      </a>
    </Link>
  )
}
