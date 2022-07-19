import Head from 'next/head'

import { useDependencies } from '../commun/contexts/useDependencies'
import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { Titre } from '../commun/Titre/Titre'
import { BlocActivitéSanitaire } from './BlocActivitéSanitaire'
import { BlocIdentitéSanitaire } from './BlocIdentitéSanitaire'
import LogoÉtablissementTerritorial from './logo-établissement-territorial-sanitaire.svg'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

type ÉtablissementTerritorialProps = Readonly<{
  établissementTerritorialViewModel: ÉtablissementTerritorialSanitaireViewModel
}>

export const PageÉtablissementTerritorialSanitaire = ({ établissementTerritorialViewModel }: ÉtablissementTerritorialProps) => {
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
      <Titre logo={LogoÉtablissementTerritorial}>
        {établissementTerritorialViewModel.titre}
      </Titre>
      <BlocIdentitéSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialViewModel} />
      <BlocActivitéSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialViewModel} />
    </>
  )
}
