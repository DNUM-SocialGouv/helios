import { ReactChild } from 'react'

export function Sources(sourceFournisseur: ReactChild, sourceOrigine?: ReactChild): ReactChild {
  if (sourceOrigine) {
    return <>
      {sourceOrigine}
      {', '}
      {sourceFournisseur}
    </>
  }

  return sourceFournisseur
}
