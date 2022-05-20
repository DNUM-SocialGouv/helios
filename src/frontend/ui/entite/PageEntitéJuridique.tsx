import { EntitéJuridique } from '../../../backend/métier/entities/EntitéJuridique'
import { useDependencies } from '../commun/contexts/useDependencies'
import { useBreadcrumb } from '../commun/hooks/useBreadcrumb'
import { BlocIdentité } from './BlocIdentité'

type EntitéJuridiqueType = {
  entitéJuridique: EntitéJuridique
}

export const PageEntitéJuridique = ({ entitéJuridique }: EntitéJuridiqueType) => {
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
        {entitéJuridique.numéroFinessEntitéJuridique + ' - ' + entitéJuridique.raisonSociale}
      </h1>
      <BlocIdentité entitéJuridique={entitéJuridique} />
    </>
  )
}
