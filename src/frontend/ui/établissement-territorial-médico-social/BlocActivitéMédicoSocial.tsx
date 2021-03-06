import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurGraphique } from '../commun/IndicateurGraphique/IndicateurGraphique'
import styles from './BlocActivitéMédicoSocial.module.css'
import { ContenuDuréeMoyenneSéjourAccompagnementPersonnesSorties } from './InfoBulle/ContenuDuréeMoyenneSéjourAccompagnementPersonnesSorties'
import { ContenuFileActivePersonnesAccompagnées } from './InfoBulle/ContenuFileActivePersonnesAccompagnées'
import { ContenuNombreMoyenJournéesAbsencePersonnesAccompagnées } from './InfoBulle/ContenuNombreMoyenJournéesAbsencePersonnesAccompagnées'
import { ContenuTauxOccupationAccueilDeJour } from './InfoBulle/ContenuTauxOccupationAccueilDeJour'
import { ContenuTauxOccupationHébergementPermanent } from './InfoBulle/ContenuTauxOccupationHébergementPermanent'
import { ContenuTauxOccupationHébergementTemporaire } from './InfoBulle/ContenuTauxOccupationHébergementTemporaire'
import { ContenuTauxRéalisationActivité } from './InfoBulle/ContenuTauxRéalisationActivité'
import { ÉtablissementTerritorialMédicoSocialViewModel } from './ÉtablissementTerritorialMédicoSocialViewModel'

type BlocActivitéMédicoSocialProps = {
  établissementTerritorialMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialViewModel
}

export const BlocActivitéMédicoSocial = ({ établissementTerritorialMédicoSocialViewModel }: BlocActivitéMédicoSocialProps) => {
  const { wording } = useDependencies()

  if (!établissementTerritorialMédicoSocialViewModel.activitéEstElleRenseignée) return null

  if (
    !établissementTerritorialMédicoSocialViewModel.leTauxOccupationHébergementPermanentEstIlRenseigné &&
    !établissementTerritorialMédicoSocialViewModel.leTauxOccupationHébergementTemporaireEstIlRenseigné &&
    !établissementTerritorialMédicoSocialViewModel.leTauxOccupationAccueilDeJourEstIlRenseigné &&
    !établissementTerritorialMédicoSocialViewModel.leTauxRéalisationActivitéEstIlRenseigné &&
    !établissementTerritorialMédicoSocialViewModel.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné &&
    !établissementTerritorialMédicoSocialViewModel.laFileActivePersonnesAccompagnéesEstElleRenseignée &&
    !établissementTerritorialMédicoSocialViewModel.laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleRenseignée
  ) {
    return (
      <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
        {wording.INDICATEURS_VIDES}
      </Bloc>
    )
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      <ul className={styles['liste-indicateurs']}>
        {établissementTerritorialMédicoSocialViewModel.leTauxOccupationHébergementPermanentEstIlRenseigné &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuTauxOccupationHébergementPermanent
              dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
              source={wording.DIAMANT}
            />}
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
            identifiant="activite-0"
            nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT}
            source={wording.DIAMANT}
          >
            {établissementTerritorialMédicoSocialViewModel.tauxOccupationHébergementPermanent}
          </IndicateurGraphique>
        }
        {établissementTerritorialMédicoSocialViewModel.leTauxOccupationHébergementTemporaireEstIlRenseigné &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuTauxOccupationHébergementTemporaire
              dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
              source={wording.DIAMANT}
            />}
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
            identifiant="activite-1"
            nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE}
            source={wording.DIAMANT}
          >
            {établissementTerritorialMédicoSocialViewModel.tauxOccupationHébergementTemporaire}
          </IndicateurGraphique>
        }
        {établissementTerritorialMédicoSocialViewModel.leTauxOccupationAccueilDeJourEstIlRenseigné &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuTauxOccupationAccueilDeJour
              dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
              source={wording.DIAMANT}
            />}
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
            identifiant="activite-2"
            nomDeLIndicateur={wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR}
            source={wording.DIAMANT}
          >
            {établissementTerritorialMédicoSocialViewModel.tauxOccupationAccueilDeJour}
          </IndicateurGraphique>
        }
        {établissementTerritorialMédicoSocialViewModel.leTauxRéalisationActivitéEstIlRenseigné &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuTauxRéalisationActivité
              dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
              source={wording.DIAMANT}
            />}
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
            identifiant="activite-3"
            nomDeLIndicateur={wording.TAUX_RÉALISATION_ACTIVITÉ}
            source={wording.DIAMANT}
          >
            {établissementTerritorialMédicoSocialViewModel.tauxRéalisationActivité}
          </IndicateurGraphique>
        }
        {établissementTerritorialMédicoSocialViewModel.laFileActivePersonnesAccompagnéesEstElleRenseignée &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuFileActivePersonnesAccompagnées
              dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
              source={wording.DIAMANT}
            />}
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
            identifiant="activite-4"
            nomDeLIndicateur={wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES}
            source={wording.DIAMANT}
          >
            {établissementTerritorialMédicoSocialViewModel.fileActivePersonnesAccompagnées}
          </IndicateurGraphique>
        }
        {établissementTerritorialMédicoSocialViewModel.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuNombreMoyenJournéesAbsencePersonnesAccompagnées
              dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
              source={wording.DIAMANT}
            />}
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
            identifiant="activite-5"
            nomDeLIndicateur={wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES}
            source={wording.DIAMANT}
          >
            {établissementTerritorialMédicoSocialViewModel.nombreMoyenJournéesAbsencePersonnesAccompagnées}
          </IndicateurGraphique>
        }
        {établissementTerritorialMédicoSocialViewModel.laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleRenseignée &&
          <IndicateurGraphique
            contenuInfoBulle={<ContenuDuréeMoyenneSéjourAccompagnementPersonnesSorties
              dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
              source={wording.DIAMANT}
            />}
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJour}
            identifiant="activite-6"
            nomDeLIndicateur={wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES}
            source={wording.DIAMANT}
          >
            {établissementTerritorialMédicoSocialViewModel.duréeMoyenneSéjourAccompagnementPersonnesSorties}
          </IndicateurGraphique>
        }
      </ul>
    </Bloc>
  )
}
