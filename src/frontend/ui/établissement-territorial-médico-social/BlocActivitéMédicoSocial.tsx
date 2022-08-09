import { Bloc } from '../commun/Bloc/Bloc'
import { useDependencies } from '../commun/contexts/useDependencies'
import { IndicateurGraphique } from '../commun/IndicateurGraphique/IndicateurGraphique'
import { Sources } from '../commun/Sources/Sources'
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

  if (
    !établissementTerritorialMédicoSocialViewModel.activitéEstElleRenseignée ||
    (
      !établissementTerritorialMédicoSocialViewModel.leTauxOccupationHébergementPermanentEstIlRenseigné &&
      !établissementTerritorialMédicoSocialViewModel.leTauxOccupationHébergementTemporaireEstIlRenseigné &&
      !établissementTerritorialMédicoSocialViewModel.leTauxOccupationAccueilDeJourEstIlRenseigné &&
      !établissementTerritorialMédicoSocialViewModel.leTauxRéalisationActivitéEstIlRenseigné &&
      !établissementTerritorialMédicoSocialViewModel.leNombreMoyenJournéesAbsencePersonnesAccompagnéesEstIlRenseigné &&
      !établissementTerritorialMédicoSocialViewModel.laFileActivePersonnesAccompagnéesEstElleRenseignée &&
      !établissementTerritorialMédicoSocialViewModel.laDuréeMoyenneSéjourAccompagnementPersonnesSortiesEstElleRenseignée
    )
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
        <IndicateurGraphique
          contenuInfoBulle={<ContenuTauxOccupationHébergementPermanent
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
            source={Sources(wording.DIAMANT, wording.CNSA)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
          identifiant="activite-0"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT}
          source={Sources(wording.DIAMANT, wording.CNSA)}
        >
          {établissementTerritorialMédicoSocialViewModel.tauxOccupationHébergementPermanent}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<ContenuTauxOccupationHébergementTemporaire
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementTemporaire}
            source={Sources(wording.DIAMANT, wording.CNSA)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementTemporaire}
          identifiant="activite-1"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE}
          source={Sources(wording.DIAMANT, wording.CNSA)}
        >
          {établissementTerritorialMédicoSocialViewModel.tauxOccupationHébergementTemporaire}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<ContenuTauxOccupationAccueilDeJour
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationAccueilDeJour}
            source={Sources(wording.DIAMANT, wording.CNSA)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationAccueilDeJour}
          identifiant="activite-2"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR}
          source={Sources(wording.DIAMANT, wording.CNSA)}
        >
          {établissementTerritorialMédicoSocialViewModel.tauxOccupationAccueilDeJour}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<ContenuTauxRéalisationActivité
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuTauxRéalisationActivité}
            source={Sources(wording.DIAMANT, wording.TDB_PERF)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuTauxRéalisationActivité}
          identifiant="activite-3"
          nomDeLIndicateur={wording.TAUX_RÉALISATION_ACTIVITÉ}
          source={Sources(wording.DIAMANT, wording.TDB_PERF)}
        >
          {établissementTerritorialMédicoSocialViewModel.tauxRéalisationActivité}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<ContenuFileActivePersonnesAccompagnées
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDeLaFileActivePersonnesAccompagnées}
            source={Sources(wording.DIAMANT, wording.TDB_PERF)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDeLaFileActivePersonnesAccompagnées}
          identifiant="activite-4"
          nomDeLIndicateur={wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES}
          source={Sources(wording.DIAMANT, wording.TDB_PERF)}
        >
          {établissementTerritorialMédicoSocialViewModel.fileActivePersonnesAccompagnées}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<ContenuNombreMoyenJournéesAbsencePersonnesAccompagnées
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuNombreMoyenJournéesAbsencePersonnesAccompagnées}
            source={Sources(wording.DIAMANT, wording.TDB_PERF)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDuNombreMoyenJournéesAbsencePersonnesAccompagnées}
          identifiant="activite-5"
          nomDeLIndicateur={wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES}
          source={Sources(wording.DIAMANT, wording.TDB_PERF)}
        >
          {établissementTerritorialMédicoSocialViewModel.nombreMoyenJournéesAbsencePersonnesAccompagnées}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={<ContenuDuréeMoyenneSéjourAccompagnementPersonnesSorties
            dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDeLaDuréeMoyenneSéjourAccompagnementPersonnesSorties}
            source={Sources(wording.DIAMANT, wording.TDB_PERF)}
          />}
          dateDeMiseÀJour={établissementTerritorialMédicoSocialViewModel.dateDeMiseÀJourDeLaDuréeMoyenneSéjourAccompagnementPersonnesSorties}
          identifiant="activite-6"
          nomDeLIndicateur={wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES}
          source={Sources(wording.DIAMANT, wording.TDB_PERF)}
        >
          {établissementTerritorialMédicoSocialViewModel.duréeMoyenneSéjourAccompagnementPersonnesSorties}
        </IndicateurGraphique>
      </ul>
    </Bloc>
  )
}
