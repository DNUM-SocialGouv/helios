import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurGraphique } from '../commun/IndicateurGraphique/IndicateurGraphique'
import { ContenuNombreDeSéjourMCO } from './InfoBulle/ContenuNombreDeSéjourMCO'
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
          contenuInfoBulle={<ContenuNombreDeSéjourMCO
            dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJour}
            source={wording.DIAMANT}
          />}
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
