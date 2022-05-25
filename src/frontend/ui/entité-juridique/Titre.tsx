import Image from 'next/image'

import { EntitéJuridiqueViewModel } from './EntitéJuridiqueViewModel'
import logoEntitéJuridique from './logo-entité-juridique.svg'

type TypeTitre = Readonly<{
    entitéJuridiqueViewModel: EntitéJuridiqueViewModel
}>

export const Titre = ({ entitéJuridiqueViewModel }: TypeTitre) => {
  return (
    <h1>
      <Image
        alt=""
        height="27"
        src={logoEntitéJuridique}
        width="27"
      />
      {entitéJuridiqueViewModel.titre}
    </h1>
  )
}
