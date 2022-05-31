import { useDependencies } from '../commun/contexts/useDependencies'
import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { BlocIdentitéMédicoSocial } from './BlocIdentitéMédicoSocial'
import { ÉtablissementTerritorialViewModel } from './ÉtablissementTerritorialViewModel'

type TypeÉtablissementTerritorial = Readonly<{
  établissementTerritorialViewModel: ÉtablissementTerritorialViewModel
}>

export const PageÉtablissementTerritorial = ({ établissementTerritorialViewModel }: TypeÉtablissementTerritorial) => {
  const { wording } = useDependencies()

  useBreadcrumb([
    {
      label: wording.DONNÉES_PERSONNELLES,
      path: '',
    },
  ])

  return (
    <>
      <h1>
        {établissementTerritorialViewModel.nomDeLÉtablissementTerritorial}
      </h1>
      <BlocIdentitéMédicoSocial établissementTerritorialViewModel={établissementTerritorialViewModel} />
    </>
  )
}
