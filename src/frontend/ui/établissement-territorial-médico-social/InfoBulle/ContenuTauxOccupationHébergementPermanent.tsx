import { ReactChild } from 'react'

import { ContenuDuTauxOccupation } from './ContenuDuTauxOccupation'

type ContenuDuTauxOccupationHébergementPermanentProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactChild
}>

export const ContenuTauxOccupationHébergementPermanent = ({ dateDeMiseÀJour, source }: ContenuDuTauxOccupationHébergementPermanentProps) => {
  return <ContenuDuTauxOccupation
    dateDeMiseÀJour={dateDeMiseÀJour}
    source={source}
  />
}
