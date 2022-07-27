import { useRouter } from 'next/router'
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

import { Résultat } from '../../../backend/métier/entities/RésultatDeRecherche'
import { useDependencies } from '../commun/contexts/useDependencies'
import { RechercheViewModel } from './RechercheViewModel'

type RechercheState = Readonly<{
  estCeEnAttente: boolean
  estCeQueLesRésultatsSontReçus: boolean
  nombreRésultats: number
  résultats: RechercheViewModel[]
  terme: string
  termeFixe: string
}>

export function useRecherche() {
  const { paths } = useDependencies()
  const router = useRouter()

  const [state, setState] = useState<RechercheState>({
    estCeEnAttente: false,
    estCeQueLesRésultatsSontReçus: false,
    nombreRésultats: 0,
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
    rechercher(state.terme)
  }

  const rechercheOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      terme: event.target.value,
    })
  }

  const rechercher = (terme: string) => {
    fetch('/api/recherche', {
      body: JSON.stringify({ terme }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        setState({
          ...state,
          estCeEnAttente: false,
          estCeQueLesRésultatsSontReçus: true,
          nombreRésultats: data.nombreDeRésultats,
          résultats: data.résultats.map((résultat: Résultat) => new RechercheViewModel(résultat, paths)),
          terme,
          termeFixe: terme,
        })
      })
  }

  useEffect(() => {
    if (router.query['terme']) {
      setState({
        ...state,
        estCeEnAttente: true,
        estCeQueLesRésultatsSontReçus: false,
        terme: router.query['terme'] as string,
      })
      rechercher(router.query['terme'] as string)
    }
  }, [])

  return {
    estCeEnAttente: state.estCeEnAttente,
    estCeQueLesRésultatsSontReçus: state.estCeQueLesRésultatsSontReçus,
    lancerLaRecherche,
    nombreRésultats: state.nombreRésultats,
    rechercheOnChange,
    résultats: state.résultats,
    terme: state.terme,
    termeFixe: state.termeFixe,
  }
}
