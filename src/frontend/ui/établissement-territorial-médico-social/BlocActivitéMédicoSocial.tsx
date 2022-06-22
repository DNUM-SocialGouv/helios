import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurGraphique } from '../commun/IndicateurGraphique/IndicateurGraphique'
import styles from './BlocActivitéMédicoSocial.module.css'
import { ContenuDuTauxOccupationEnAccueilDeJour } from './InfoBulle/ContenuDuTauxOccupationEnAccueilDeJour'
import { ContenuDuTauxOccupationHébergementPermanent } from './InfoBulle/ContenuDuTauxOccupationHébergementPermanent'
import { ContenuDuTauxOccupationHébergementTemporaire } from './InfoBulle/ContenuDuTauxOccupationHébergementTemporaire'
import { ÉtablissementTerritorialMédicoSocialViewModel } from './ÉtablissementTerritorialMédicoSocialViewModel'

type BlocActivitéMédicoSocialType = {
  établissementTerritorialMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialViewModel
}

export const BlocActivitéMédicoSocial = ({ établissementTerritorialMédicoSocialViewModel }: BlocActivitéMédicoSocialType) => {
  const { wording } = useDependencies()

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      <ul className={styles['liste-indicateurs']}>
        <IndicateurGraphique
          contenuInfoBulle={<ContenuDuTauxOccupationHébergementPermanent
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
            source={wording.DIAMANT}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          identifiant="activite-1"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT}
          source={wording.DIAMANT}
        >
          {établissementTerritorialMédicoSocialViewModel.tauxOccupationHébergementPermanent}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<ContenuDuTauxOccupationHébergementTemporaire
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
            source={wording.DIAMANT}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          identifiant="activite-2"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE}
          source={wording.DIAMANT}
        >
          {établissementTerritorialMédicoSocialViewModel.tauxOccupationHébergementTemporaire}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<ContenuDuTauxOccupationEnAccueilDeJour
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
            source={wording.DIAMANT}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          identifiant="activite-3"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_ACCUEIL_DE_JOUR}
          source={wording.DIAMANT}
        >
          {établissementTerritorialMédicoSocialViewModel.tauxOccupationHébergementAccueilDeJour}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<></>}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          identifiant="activite-4"
          nomDeLIndicateur={wording.TAUX_RÉALISATION_ACTIVITÉ}
          source={wording.DIAMANT}
        >
          {établissementTerritorialMédicoSocialViewModel.tauxRéalisationActivité}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<></>}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          identifiant="activite-5"
          nomDeLIndicateur={wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES_SUR_PERIODE}
          source={wording.DIAMANT}
        >
          {établissementTerritorialMédicoSocialViewModel.fileActiveDesPersonnesAccompagnéesSurLaPériode}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<></>}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          identifiant="activite-6"
          nomDeLIndicateur={wording.NOMBRE_MOYEN_JOURNÉE_ABSENCE_PERSONNES_ACCOMPAGNÉES_SUR_PERIODE}
          source={wording.DIAMANT}
        >
          {établissementTerritorialMédicoSocialViewModel.nombreMoyenJournéesAbsenceDesPersonnesAccompagnésSurPeriode}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<></>}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
          identifiant="activite-7"
          nomDeLIndicateur={wording.DURÉE_MOEYNNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES}
          source={wording.DIAMANT}
        >
          {établissementTerritorialMédicoSocialViewModel.duréeMoyenneSéjourEtAcompagnementDesPersonnesSorties}
        </IndicateurGraphique>
      </ul>
    </Bloc>
  )
}
