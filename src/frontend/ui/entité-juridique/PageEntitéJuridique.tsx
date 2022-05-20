import { useDependencies } from '../commun/contexts/useDependencies'
import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { BlocIdentité } from './BlocIdentité'
import { EntitéJuridiqueViewModel } from './EntitéJuridiqueViewModel'

type TypeEntitéJuridique = Readonly<{
  entitéJuridiqueViewModel: EntitéJuridiqueViewModel
}>

export const PageEntitéJuridique = ({ entitéJuridiqueViewModel }: TypeEntitéJuridique) => {
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
        {entitéJuridiqueViewModel.titre}
      </h1>
      <BlocIdentité entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
    </>
  )
}
