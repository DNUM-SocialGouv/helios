import { ReactChild } from 'react'

export function buildSource(sourceFournisseur: ReactChild, sourceOrigine: ReactChild) {
  let source

  if (sourceOrigine) {
    source = <>
      {sourceOrigine}
      ,&nbsp;
      {sourceFournisseur}
    </>
  } else {
    source = sourceFournisseur
  }
  return source
}
