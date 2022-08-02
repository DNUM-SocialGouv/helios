import { ReactChild } from 'react'

export function buildSource(sourceFournisseur: ReactChild, sourceOrigine: ReactChild): ReactChild {
  if (sourceOrigine) {
    return <>
      {sourceOrigine}
      {', '}
      {sourceFournisseur}
    </>
  }
  return sourceFournisseur
}
