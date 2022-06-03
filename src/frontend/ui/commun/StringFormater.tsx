import { ReactElement } from 'react'

export namespace StringFormater{
  export function formateLeNuméroFiness(numéroFiness: string): string {
    return `${numéroFiness.substring(0, 2)} ${numéroFiness.substring(2)}`
  }

  export function formateLeNuméroFinessAvecExergueSurLeDépartement(numéroFiness: string): ReactElement {
    return (
      <>
        <strong className="fr-text--lg">
          {numéroFiness.substring(0, 2)}
        </strong>
        {` ${numéroFiness.substring(2)}`}
      </>
    )
  }

  export function formateLeNuméroDeTéléphone(téléphone: string): string {
    return insèreUnEspaceTousLesNCaractères(téléphone, 2)
  }

  // format DD/MM/AAAA
  export function formateLaDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  function insèreUnEspaceTousLesNCaractères(str: string, nombreDeCaractères: number): string {
    return str.split('').map((letter, index) => index % nombreDeCaractères === 0 ? ' ' + letter : letter).join('').trim()
  }
}
