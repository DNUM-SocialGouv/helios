import { useEffect, useState } from 'react'

import { FilDArianne } from '../../../configuration/FilDArianneHandler'
import { useDependencies } from '../contexts/useDependencies'

export function useFileDArianne(filDArianneInitial: FilDArianne) {
  const { filDArianneHandler } = useDependencies()
  const [filDArianne, setFilDArianne] = useState<FilDArianne>(filDArianneInitial || [])

  useEffect(() => {
    filDArianneHandler.metAJourLeFilDArianne(filDArianne)
    filDArianneHandler.ajouteAbonnement(setFilDArianne)
  }, [])

  return { filDArianne }
}
