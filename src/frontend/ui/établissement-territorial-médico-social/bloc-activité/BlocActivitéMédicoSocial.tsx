import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuDuréeMoyenneSéjourAccompagnementPersonnesSorties } from "../InfoBulle/ContenuDuréeMoyenneSéjourAccompagnementPersonnesSorties";
import { ContenuFileActivePersonnesAccompagnées } from "../InfoBulle/ContenuFileActivePersonnesAccompagnées";
import { ContenuNombreMoyenJournéesAbsencePersonnesAccompagnées } from "../InfoBulle/ContenuNombreMoyenJournéesAbsencePersonnesAccompagnées";
import { ContenuTauxOccupationAccueilDeJour } from "../InfoBulle/ContenuTauxOccupationAccueilDeJour";
import { ContenuTauxOccupationHébergementPermanent } from "../InfoBulle/ContenuTauxOccupationHébergementPermanent";
import { ContenuTauxOccupationHébergementTemporaire } from "../InfoBulle/ContenuTauxOccupationHébergementTemporaire";
import { ContenuTauxRéalisationActivité } from "../InfoBulle/ContenuTauxRéalisationActivité";
import styles from "./BlocActivitéMédicoSocial.module.css";
import { ÉtablissementTerritorialMédicoSocialActivitéViewModel } from "./ÉtablissementTerritorialMédicoSocialActivitéViewModel";

type BlocActivitéMédicoSocialProps = Readonly<{
  établissementTerritorialActivitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialActivitéViewModel;
}>;

export const BlocActivitéMédicoSocial = ({ établissementTerritorialActivitéMédicoSocialViewModel }: BlocActivitéMédicoSocialProps) => {
  const { wording } = useDependencies();

  if (établissementTerritorialActivitéMédicoSocialViewModel.lesDonnéesActivitéNeSontPasRenseignées) {
    return <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>{wording.INDICATEURS_VIDES}</Bloc>;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_ACTIVITÉ}>
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        <IndicateurGraphique
          contenuInfoBulle={
            <ContenuTauxOccupationHébergementPermanent
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
              source={wording.CNSA}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementPermanent}
          identifiant="activite-0"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT}
          source={wording.CNSA}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationHébergementPermanent}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={
            <ContenuTauxOccupationHébergementTemporaire
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementTemporaire}
              source={wording.CNSA}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationHébergementTemporaire}
          identifiant="activite-1"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE}
          source={wording.CNSA}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationHébergementTemporaire}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={
            <ContenuTauxOccupationAccueilDeJour
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationAccueilDeJour}
              source={wording.CNSA}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxOccupationAccueilDeJour}
          identifiant="activite-2"
          nomDeLIndicateur={wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR}
          source={wording.CNSA}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxOccupationAccueilDeJour}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={
            <ContenuTauxRéalisationActivité
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxRéalisationActivité}
              source={wording.TDB_PERF}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuTauxRéalisationActivité}
          identifiant="activite-3"
          nomDeLIndicateur={wording.TAUX_RÉALISATION_ACTIVITÉ}
          source={wording.TDB_PERF}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.tauxRéalisationActivité}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={
            <ContenuFileActivePersonnesAccompagnées
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDeLaFileActivePersonnesAccompagnées}
              source={wording.TDB_PERF}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDeLaFileActivePersonnesAccompagnées}
          identifiant="activite-4"
          nomDeLIndicateur={wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES}
          source={wording.TDB_PERF}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.fileActivePersonnesAccompagnées}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={
            <ContenuNombreMoyenJournéesAbsencePersonnesAccompagnées
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuNombreMoyenJournéesAbsencePersonnesAccompagnées}
              source={wording.TDB_PERF}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDuNombreMoyenJournéesAbsencePersonnesAccompagnées}
          identifiant="activite-5"
          nomDeLIndicateur={wording.NOMBRE_MOYEN_JOURNÉES_ABSENCE_PERSONNES_ACCOMPAGNÉES}
          source={wording.TDB_PERF}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.nombreMoyenJournéesAbsencePersonnesAccompagnées}
        </IndicateurGraphique>
        <IndicateurGraphique
          contenuInfoBulle={
            <ContenuDuréeMoyenneSéjourAccompagnementPersonnesSorties
              dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDeLaDuréeMoyenneSéjourAccompagnementPersonnesSorties}
              source={wording.TDB_PERF}
            />
          }
          dateDeMiseÀJour={établissementTerritorialActivitéMédicoSocialViewModel.dateDeMiseÀJourDeLaDuréeMoyenneSéjourAccompagnementPersonnesSorties}
          identifiant="activite-6"
          nomDeLIndicateur={wording.DURÉE_MOYENNE_SÉJOUR_ACCOMPAGNEMENT_PERSONNES_SORTIES}
          source={wording.TDB_PERF}
        >
          {établissementTerritorialActivitéMédicoSocialViewModel.duréeMoyenneSéjourAccompagnementPersonnesSorties}
        </IndicateurGraphique>
      </ul>
    </Bloc>
  );
};
