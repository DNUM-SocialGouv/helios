import Head from 'next/head'

import { useDependencies } from '../commun/contexts/useDependencies'
import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { BlocIdentitéSanitaire } from './BlocIdentitéSanitaire'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

type TypeÉtablissementTerritorial = Readonly<{
  établissementTerritorialViewModel: ÉtablissementTerritorialSanitaireViewModel
}>

export const PageÉtablissementTerritorialSanitaire = ({ établissementTerritorialViewModel }: TypeÉtablissementTerritorial) => {
  const { paths } = useDependencies()

  useBreadcrumb([
    {
      label: établissementTerritorialViewModel.titreAccessibleDeLEntitéJuridique,
      path: `${paths.ENTITÉ_JURIDIQUE}/${établissementTerritorialViewModel.numéroFinessEntitéJuridiqueBrut}`,
    },
    {
      label: établissementTerritorialViewModel.nomDeLÉtablissementTerritorial,
      path: '',
    },
  ])

  return (
    <>
      <Head>
        <title>
          {établissementTerritorialViewModel.titre}
        </title>
      </Head>
      <BlocIdentitéSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialViewModel} />
    </>
  )
}
