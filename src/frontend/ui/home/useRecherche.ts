import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

import { Résultat } from '../../../backend/métier/entities/RésultatDeRecherche'
import { useDependencies } from '../commun/contexts/useDependencies'
import { RechercheViewModel } from './RechercheViewModel'

type RechercheState = Readonly<{
  estCeEnAttente: boolean
  estCeQueLesRésultatsSontReçus: boolean
  nombreResultat: number
  résultats: RechercheViewModel[]
  terme: string
  termeFixe: string
}>

export function useRecherche() {
  const { paths } = useDependencies()

  const [state, setState] = useState<RechercheState>({
    estCeEnAttente: false,
    estCeQueLesRésultatsSontReçus: false,
    nombreResultat: 0,
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
          nombreResultat: data.nombreDeRésultats,
          résultats: data.résultats.map((résultat: Résultat) => new RechercheViewModel(résultat, paths)),
          termeFixe: state.terme,
        })
      })
  }

  useEffect(() => {
    if (state.estCeEnAttente) {
      rechercher()
    }
  }, [state.estCeEnAttente])

  return {
    estCeEnAttente: state.estCeEnAttente,
    estCeQueLesRésultatsSontReçus: state.estCeQueLesRésultatsSontReçus,
    lancerLaRecherche,
    nombreResultat: state.nombreResultat,
    rechercheOnChange,
    résultats: state.résultats,
    terme: state.terme,
    termeFixe: state.termeFixe,
  }
}
