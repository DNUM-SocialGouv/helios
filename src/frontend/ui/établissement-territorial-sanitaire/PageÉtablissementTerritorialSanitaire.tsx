import { useDependencies } from '../commun/contexts/useDependencies'
import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { BlocIdentitéSanitaire } from './BlocIdentitéSanitaire'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

type TypeÉtablissementTerritorial = Readonly<{
  établissementTerritorialViewModel: ÉtablissementTerritorialSanitaireViewModel
}>

export const PageÉtablissementTerritorialSanitaire = ({ établissementTerritorialViewModel }: TypeÉtablissementTerritorial) => {
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
      <BlocIdentitéSanitaire établissementTerritorialSanitaireViewModel={établissementTerritorialViewModel} />
    </>
  )
}
