import { ReactElement } from 'react'

import { ContenuDuTauxOccupation } from './ContenuDuTauxOccupation'

type ContenuDuTauxOccupationHébergementPermanentProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactElement
}>

export const ContenuTauxOccupationHébergementPermanent = ({ dateDeMiseÀJour, source }: ContenuDuTauxOccupationHébergementPermanentProps) => {
  return <ContenuDuTauxOccupation dateDeMiseÀJour={dateDeMiseÀJour} source={source} />
}
