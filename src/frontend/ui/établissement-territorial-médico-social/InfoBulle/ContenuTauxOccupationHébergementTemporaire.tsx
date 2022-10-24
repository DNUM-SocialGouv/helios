import { ReactElement } from 'react'

import { ContenuDuTauxOccupation } from './ContenuDuTauxOccupation'

type ContenuDuTauxOccupationHébergementTemporaireProps = Readonly<{
  dateDeMiseÀJour: string
  source: ReactElement
}>

export const ContenuTauxOccupationHébergementTemporaire = ({ dateDeMiseÀJour, source }: ContenuDuTauxOccupationHébergementTemporaireProps) => {
  return <ContenuDuTauxOccupation
    dateDeMiseÀJour={dateDeMiseÀJour}
    source={source}
  />
}
