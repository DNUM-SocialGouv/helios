import Link from 'next/link'

import styles from './ActionneurDAccordéon.module.css'

type ActionneurDAccordéonProps = Readonly<{
  for: string
  texteGras?: boolean
  titre: string
}>

export const ActionneurDAccordéon = ({ for: identifiant, titre, texteGras = true }: ActionneurDAccordéonProps) => {

  return (
    <Link
      aria-controls={identifiant}
      aria-expanded="false"
      className={`fr-tag fr-text-label--grey ${texteGras ? 'fr-text--bold' : ''} ` + styles['tag-actionnable']}
      href="#"
      onClick={(event) => {
        event.preventDefault()
      }}
      passHref
    >
      {titre}
    </Link>
  )
}
