import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurGraphique } from '../commun/IndicateurGraphique/IndicateurGraphique'
import styles from './BlocActivitéSanitaire.module.css'
import { ContenuNombreDePassagesAuxUrgences } from './InfoBulle/ContenuNombreDePassagesAuxUrgences'
import { ContenuNombreDeSéjourMCO } from './InfoBulle/ContenuNombreDeSéjourMCO'
import { ÉtablissementTerritorialSanitaireViewModel } from './ÉtablissementTerritorialSanitaireViewModel'

type BlocActivitéSanitaireType = {
  établissementTerritorialSanitaireViewModel: ÉtablissementTerritorialSanitaireViewModel
}

export const BlocActivitéSanitaire = ({ établissementTerritorialSanitaireViewModel }: BlocActivitéSanitaireType) => {
  const { wording } = useDependencies()

  if (!établissementTerritorialSanitaireViewModel.activitéEstElleRenseignée) return null

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      <ul className={styles['liste-indicateurs']}>
        {établissementTerritorialSanitaireViewModel.lesIndicateursMCOSontIlsRenseignés &&
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
          { établissementTerritorialSanitaireViewModel.nombreDeSéjoursMédecineChirurgieObstétrique }
        </IndicateurGraphique>
        }

        <IndicateurGraphique
          contenuInfoBulle={<ContenuNombreDePassagesAuxUrgences
            dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJour}
            source={wording.DIAMANT}
          />}
          dateDeMiseÀJour={établissementTerritorialSanitaireViewModel.dateDeMiseÀJour}
          identifiant="activite-3"
          nomDeLIndicateur={wording.NOMBRE_DE_PASSAGES_AUX_URGENCES}
          source={wording.DIAMANT}
        >
          {établissementTerritorialSanitaireViewModel.nombreDePassagesAuxUrgences}
        </IndicateurGraphique>
      </ul>
    </Bloc>
  )
}
