import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurGraphique } from '../commun/IndicateurGraphique/IndicateurGraphique'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

type BlocActivitéSanitaireType = {
  établissementTerritorialSanitaireViewModel: ÉtablissementTerritorialSanitaireViewModel
}

export const BlocActivitéSanitaire = ({ établissementTerritorialSanitaireViewModel }: BlocActivitéSanitaireType) => {
  const { wording } = useDependencies()

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      <ul>
        <IndicateurGraphique
          contenuInfoBulle={<></>}
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJour}
          identifiant="activite-0"
          nomDeLIndicateur={wording.NOMBRE_DE_SÉJOUR_MCO}
          source={wording.DIAMANT}
        >
          { établissementTerritorialSanitaireViewModel.nombreDeSéjoursMCO }
        </IndicateurGraphique>
      </ul>
    </Bloc>
  )
}
