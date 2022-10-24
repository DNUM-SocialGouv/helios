export namespace StringFormater {
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

  export function formateLeMontantEnEuros(montant: number): string {
    return `${Math.round(montant).toLocaleString('fr')} €`.replace('-', '−')
  }

  export function formateEnFrançais(valeurs: (number | null)[]): (string | null)[] {
    return valeurs.map((valeur) => {
      if (valeur === null) return valeur

      return valeur.toLocaleString('fr')
    })
  }

  export function ajouteLePourcentage(valeurs: number[]): string[] {
    return formateEnFrançais(valeurs).map((valeur) => valeur + ' %')
  }

  export function transformeEnTaux(nombre: number): number {
    return Number((nombre * 100).toFixed(1))
  }
}
