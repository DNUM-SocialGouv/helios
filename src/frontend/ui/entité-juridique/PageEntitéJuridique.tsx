import Head from 'next/head'

import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { Titre } from '../commun/Titre/Titre'
import { BlocIdentité } from './BlocIdentité'
import { EntitéJuridiqueViewModel } from './EntitéJuridiqueViewModel'
import { ListeDesÉtablissementsTerritoriauxRattachés } from './ListeDesÉtablissementsTerritoriauxRattachés'
import LogoEntitéJuridique from './logo-entité-juridique.svg'
import { ÉtablissementTerritorialRattachéViewModel } from './ÉtablissementTerritorialRattachéViewModel'

type TypeEntitéJuridique = Readonly<{
  entitéJuridiqueViewModel: EntitéJuridiqueViewModel
  établissementsTerritoriauxRattachésViewModels: ÉtablissementTerritorialRattachéViewModel[]
}>

export const PageEntitéJuridique = ({ entitéJuridiqueViewModel, établissementsTerritoriauxRattachésViewModels }: TypeEntitéJuridique) => {
  useBreadcrumb([
    {
      label: entitéJuridiqueViewModel.titreAccessible,
      path: '',
    },
  ])

  return (
    <>
      <Head>
        <title>
          {entitéJuridiqueViewModel.titre}
        </title>
      </Head>
      <Titre logo={LogoEntitéJuridique}>
        {entitéJuridiqueViewModel.titre}
      </Titre>
      <BlocIdentité entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
      <ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels} />
    </>
  )
}
