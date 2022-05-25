import { useDependencies } from '../commun/contexts/useDependencies'
import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { BlocIdentité } from './BlocIdentité'
import { EntitéJuridiqueViewModel } from './EntitéJuridiqueViewModel'
import { Titre } from './Titre'

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
      <Titre>
        {entitéJuridiqueViewModel.titre}
      </Titre>
      <BlocIdentité entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
    </>
  )
}
