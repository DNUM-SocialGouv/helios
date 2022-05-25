import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurIdentité } from '../commun/IndicateurIdentité/IndicateurIdentité'
import { ÉtablissementTerritorialViewModel } from './ÉtablissementTerritorialViewModel'

type BlocIdentitéType = {
  établissementTerritorialViewModel: ÉtablissementTerritorialViewModel
}

export const BlocIdentitéMédicoSocial = ({ établissementTerritorialViewModel }: BlocIdentitéType) => {
  const { wording } = useDependencies()

  return (
    <Bloc titre={wording.TITRE_BLOC_IDENTITÉ}>
      <ul>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialViewModel.dateDeMiseÀJour}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={wording.FINESS}
          valeur={établissementTerritorialViewModel.nomDeLÉtablissementTerritorial}
        />
      </ul>
    </Bloc>
  )
}
