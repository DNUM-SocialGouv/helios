import { ReactChild } from 'react'

import { ContenuDuTauxOccupation } from './ContenuDuTauxOccupation'

type ContenuDuTauxOccupationHébergementPermanentProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuDuTauxOccupationHébergementPermanent = ({ dateDeMiseÀJour, source }: ContenuDuTauxOccupationHébergementPermanentProps) => {
  return <ContenuDuTauxOccupation
    dateDeMiseÀJour={dateDeMiseÀJour}
    source={source}
  />
}
