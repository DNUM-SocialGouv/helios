import { ReactChild } from 'react'

import { ContenuDuTauxOccupation } from './ContenuDuTauxOccupation'

type ContenuDuTauxOccupationHébergementTemporaireProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuTauxOccupationHébergementTemporaire = ({ dateDeMiseÀJour, source }: ContenuDuTauxOccupationHébergementTemporaireProps) => {
  return <ContenuDuTauxOccupation
    dateDeMiseÀJour={dateDeMiseÀJour}
    source={source}
  />
}
