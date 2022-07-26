import { ChangeEvent, MouseEvent, useState } from 'react'

import { Résultat } from '../../../backend/métier/entities/RésultatDeRecherche'
import { useDependencies } from '../commun/contexts/useDependencies'
import { RechercheViewModel } from './RechercheViewModel'

type RechercheState = Readonly<{
  estCeEnAttente: boolean
  estCeQueLesRésultatsSontReçus: boolean
  nombreRésultat: number
  résultats: RechercheViewModel[]
  terme: string
  termeFixe: string
}>

export function useRecherche() {
  const { paths } = useDependencies()

  const [state, setState] = useState<RechercheState>({
    estCeEnAttente: false,
    estCeQueLesRésultatsSontReçus: false,
    nombreRésultat: 0,
    résultats: [],
    terme: '',
    termeFixe: '',
  })

  const lancerLaRecherche = (event: MouseEvent) => {
    event.preventDefault()
    setState({
      ...state,
      estCeEnAttente: true,
      estCeQueLesRésultatsSontReçus: false,
    })
    rechercher()
  }

  const rechercheOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      terme: event.target.value,
    })
  }

  const rechercher = () => {
    fetch('/api/recherche', {
      body: JSON.stringify({ terme: state.terme }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        setState({
          ...state,
          estCeEnAttente: false,
          estCeQueLesRésultatsSontReçus: true,
          nombreRésultat: data.nombreDeRésultats,
          résultats: data.résultats.map((résultat: Résultat) => new RechercheViewModel(résultat, paths)),
          termeFixe: state.terme,
        })
      })
  }

  return {
    estCeEnAttente: state.estCeEnAttente,
    estCeQueLesRésultatsSontReçus: state.estCeQueLesRésultatsSontReçus,
    lancerLaRecherche,
    nombreRésultat: state.nombreRésultat,
    rechercheOnChange,
    résultats: state.résultats,
    terme: state.terme,
    termeFixe: state.termeFixe,
  }
}
