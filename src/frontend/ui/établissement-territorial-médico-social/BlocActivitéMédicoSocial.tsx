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

type BlocActivitéMédicoSocialType = {
  établissementTerritorialMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialViewModel
}

export const BlocActivitéMédicoSocial = ({ établissementTerritorialMédicoSocialViewModel }: BlocActivitéMédicoSocialType) => {
  const { wording } = useDependencies()

  if (!établissementTerritorialMédicoSocialViewModel.activitéEstElleRemplie) return null

  if (
    !(établissementTerritorialMédicoSocialViewModel.leTauxOccupationHébergementPermanentEstIlRempli &&
    établissementTerritorialMédicoSocialViewModel.leTauxOccupationHébergementTemporaireEstIlRempli &&
    établissementTerritorialMédicoSocialViewModel.leTauxOccupationAccueilDeJourEstIlRempli &&
    établissementTerritorialMédicoSocialViewModel.leTauxRéalisationActivitéEstIlRempli &&
    établissementTerritorialMédicoSocialViewModel.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRempli &&
    établissementTerritorialMédicoSocialViewModel.laFileActivePersonnesAccompagnéesEstElleRemplie &&
    établissementTerritorialMédicoSocialViewModel.laDuréeMoyenneSéjourAcompagnementDesPersonnesSortiesEstElleRempli)
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
        {établissementTerritorialMédicoSocialViewModel.leTauxOccupationHébergementPermanentEstIlRempli &&
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
        {établissementTerritorialMédicoSocialViewModel.leTauxOccupationHébergementTemporaireEstIlRempli &&
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
        {établissementTerritorialMédicoSocialViewModel.leTauxOccupationAccueilDeJourEstIlRempli &&
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
        {établissementTerritorialMédicoSocialViewModel.leTauxRéalisationActivitéEstIlRempli &&
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
        {établissementTerritorialMédicoSocialViewModel.laFileActivePersonnesAccompagnéesEstElleRemplie &&
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
        {établissementTerritorialMédicoSocialViewModel.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRempli &&
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
        {établissementTerritorialMédicoSocialViewModel.laDuréeMoyenneSéjourAcompagnementDesPersonnesSortiesEstElleRempli &&
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
            {établissementTerritorialMédicoSocialViewModel.duréeMoyenneSéjourAcompagnementDesPersonnesSorties}
          </IndicateurGraphique>
        }
      </ul>
    </Bloc>
  )
}
